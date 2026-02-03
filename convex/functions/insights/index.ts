import {
  action,
  internalMutation,
  internalQuery,
  query,
  mutation,
} from "../../_generated/server";
import { v } from "convex/values";
import { requireOrganizationId, requireUserId } from "../../lib/users";

const PROMPT_VERSION = "v1";
const DEFAULT_MODEL = "gemini-1.5-flash";

function assertConfigured(value: string | undefined, name: string) {
  if (!value || value.trim().length === 0)
    throw new Error(`${name} is not configured`);
}

function buildPrompt(params: {
  date: string;
  moodSummary: {
    total: number;
    lastMood: string | null;
    counts: Record<string, number>;
  };
}) {
  return [
    `You are a supportive, non-judgmental parenting wellness coach.`,
    `Write a short daily insight for a parent.`,
    `Do NOT give medical advice. Do NOT diagnose. Do NOT mention being an AI.`,
    `If the user seems in crisis, encourage reaching out to a trusted person and local emergency services (do not mention numbers).`,
    ``,
    `Return exactly two lines:`,
    `Title: <short title>`,
    `Message: <1-2 sentences, max 220 tokens>`,
    ``,
    `Date: ${params.date}`,
    `MoodSummary: ${JSON.stringify(params.moodSummary)}`,
  ].join("\n");
}

function parseInsight(text: string): { title: string; message: string } {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const titleLine = lines.find((l) => l.toLowerCase().startsWith("title:"));
  const messageLine = lines.find((l) => l.toLowerCase().startsWith("message:"));
  const title = titleLine?.slice("title:".length).trim();
  const message = messageLine?.slice("message:".length).trim();
  if (!title || !message)
    throw new Error("Could not parse insight from Gemini response");
  return { title, message };
}

async function geminiGenerateText(params: {
  apiKey: string;
  model: string;
  prompt: string;
}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    params.model
  )}:generateContent?key=${encodeURIComponent(params.apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: params.prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 220 },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini request failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as any;
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Gemini returned empty response");
  }
  return text.trim();
}

// --- Preferences (opt-in) ---

export const getAiInsightSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("clerkOrganizationId", orgId)
      )
      .first();

    return {
      aiInsightsEnabled: existing?.aiInsightsEnabled ?? false,
    };
  },
});

export const setAiInsightsEnabled = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("clerkOrganizationId", orgId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        aiInsightsEnabled: args.enabled,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userPreferences", {
        clerkOrganizationId: orgId,
        userId,
        aiInsightsEnabled: args.enabled,
        updatedAt: Date.now(),
      });
    }

    return { aiInsightsEnabled: args.enabled };
  },
});

// --- Internal helpers for action DB work ---

export const _getCachedDailyInsight = internalQuery({
  args: { userId: v.id("users"), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiDailyInsights")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .first();
  },
});

export const _getMoodSummary = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sinceMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const moodEntries = await ctx.db
      .query("moodCheckIns")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gt(q.field("createdAt"), sinceMs))
      .collect();

    const counts: Record<string, number> = {
      great: 0,
      good: 0,
      okay: 0,
      low: 0,
      struggling: 0,
    };
    let lastMood: string | null = null;
    let lastCreatedAt = -1;
    for (const m of moodEntries as any[]) {
      if (typeof m?.mood === "string" && m.mood in counts) counts[m.mood] += 1;
      if (typeof m?.createdAt === "number" && m.createdAt > lastCreatedAt) {
        lastCreatedAt = m.createdAt;
        lastMood = m.mood ?? null;
      }
    }

    return { total: moodEntries.length, lastMood, counts };
  },
});

export const _insertDailyInsight = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    userId: v.id("users"),
    date: v.string(),
    model: v.string(),
    promptVersion: v.string(),
    title: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("aiDailyInsights", {
      clerkOrganizationId: args.clerkOrganizationId,
      userId: args.userId,
      date: args.date,
      model: args.model,
      promptVersion: args.promptVersion,
      title: args.title,
      message: args.message,
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

// --- Public action ---

export const generateDailyInsight = action({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    const { internal } = (await import("../../_generated/api")) as any;

    const settings = await ctx.runQuery(
      internal.functions.insights.index.getAiInsightSettings,
      {}
    );
    if (!settings.aiInsightsEnabled) return null;

    const cached: any = await ctx.runQuery(
      internal.functions.insights.index._getCachedDailyInsight,
      {
        userId,
        date: args.date,
      }
    );
    if (cached) return cached;

    const apiKey = process.env.GEMINI_API_KEY as string | undefined;
    const model =
      (process.env.GEMINI_MODEL as string | undefined) ?? DEFAULT_MODEL;
    assertConfigured(apiKey, "GEMINI_API_KEY");

    const moodSummary = await ctx.runQuery(
      internal.functions.insights.index._getMoodSummary,
      { userId }
    );
    const prompt = buildPrompt({ date: args.date, moodSummary });

    const raw = await geminiGenerateText({ apiKey: apiKey!, model, prompt });
    const parsed = parseInsight(raw);

    return await ctx.runMutation(
      internal.functions.insights.index._insertDailyInsight,
      {
        clerkOrganizationId: orgId,
        userId,
        date: args.date,
        model,
        promptVersion: PROMPT_VERSION,
        title: parsed.title,
        message: parsed.message,
      }
    );
  },
});
