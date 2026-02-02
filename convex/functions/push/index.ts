import {
  action,
  internalAction,
  internalQuery,
  mutation,
  query,
} from "../../_generated/server";
import { v } from "convex/values";
import { requireMutationUserId, requireOrganizationId } from "../../lib/users";

function isExpoPushToken(token: string) {
  return (
    token.startsWith("ExponentPushToken[") || token.startsWith("ExpoPushToken[")
  );
}

export const getPushSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireMutationUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    const pref = await ctx.db
      .query("userPreferences")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("clerkOrganizationId", orgId)
      )
      .first();

    return {
      pushNotificationsEnabled: Boolean(pref?.pushNotificationsEnabled),
    };
  },
});

export const setPushNotificationsEnabled = mutation({
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
        pushNotificationsEnabled: args.enabled,
        updatedAt: Date.now(),
      });
    } else {
      // Default AI insights to false if not present yet.
      await ctx.db.insert("userPreferences", {
        clerkOrganizationId: orgId,
        userId,
        aiInsightsEnabled: false,
        pushNotificationsEnabled: args.enabled,
        updatedAt: Date.now(),
      });
    }

    return { pushNotificationsEnabled: args.enabled };
  },
});

export const upsertExpoPushToken = mutation({
  args: { expoPushToken: v.string(), platform: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    if (!isExpoPushToken(args.expoPushToken)) {
      throw new Error("Invalid Expo push token");
    }

    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_user_and_token", (q) =>
        q.eq("userId", userId).eq("expoPushToken", args.expoPushToken)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        updatedAt: Date.now(),
        platform: args.platform,
      });
      return { status: "updated" as const };
    }

    await ctx.db.insert("pushTokens", {
      clerkOrganizationId: orgId,
      userId,
      expoPushToken: args.expoPushToken,
      platform: args.platform,
      updatedAt: Date.now(),
    });

    return { status: "created" as const };
  },
});

export const _getUserPushSettings = internalQuery({
  args: { userId: v.id("users"), clerkOrganizationId: v.string() },
  handler: async (ctx, args) => {
    const pref = await ctx.db
      .query("userPreferences")
      .withIndex("by_user_and_org", (q) =>
        q
          .eq("userId", args.userId)
          .eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .first();

    return {
      pushNotificationsEnabled: Boolean(pref?.pushNotificationsEnabled),
    };
  },
});

export const _getUserTokensForOrg = internalQuery({
  args: { userId: v.id("users"), clerkOrganizationId: v.string() },
  handler: async (ctx, args) => {
    const tokens = await ctx.db
      .query("pushTokens")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.eq(q.field("clerkOrganizationId"), args.clerkOrganizationId)
      )
      .collect();
    return (tokens as any[]).map((t) => ({
      expoPushToken: t.expoPushToken as string,
    }));
  },
});

async function sendExpoPush(params: {
  token: string;
  title: string;
  body: string;
}) {
  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: params.token,
      title: params.title,
      body: params.body,
      sound: "default",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expo push failed (${res.status}): ${text}`);
  }

  return await res.json();
}

export const sendTestPush = action({
  args: {},
  handler: async (ctx) => {
    const userId = await requireMutationUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    const { internal } = (await import("../../_generated/api")) as any;

    const pref = await ctx.runQuery(
      internal.functions.push.index._getUserPushSettings,
      {
        userId,
        clerkOrganizationId: orgId,
      }
    );
    if (!pref.pushNotificationsEnabled) {
      throw new Error("Push notifications are disabled");
    }

    const orgTokens: { expoPushToken: string }[] = await ctx.runQuery(
      internal.functions.push.index._getUserTokensForOrg,
      {
        userId,
        clerkOrganizationId: orgId,
      }
    );
    if (orgTokens.length === 0) {
      throw new Error("No push tokens registered for this user");
    }

    const token: string = orgTokens[0].expoPushToken;
    return await sendExpoPush({
      token,
      title: "Alora",
      body: "Push notifications are set up.",
    });
  },
});

export const _getEnabledOrgTokens = internalQuery({
  args: { clerkOrganizationId: v.string() },
  handler: async (ctx, args) => {
    const tokens = await ctx.db
      .query("pushTokens")
      .withIndex("by_org", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .collect();

    const enabledTokens: { expoPushToken: string }[] = [];
    for (const t of tokens as any[]) {
      const pref = await ctx.db
        .query("userPreferences")
        .withIndex("by_user_and_org", (q) =>
          q
            .eq("userId", t.userId)
            .eq("clerkOrganizationId", args.clerkOrganizationId)
        )
        .first();

      if (pref?.pushNotificationsEnabled) {
        enabledTokens.push({ expoPushToken: t.expoPushToken });
      }
    }

    return enabledTokens;
  },
});

export const sendAppointmentReminder = internalAction({
  args: {
    clerkOrganizationId: v.string(),
    appointmentTitle: v.string(),
    appointmentWhen: v.string(),
  },
  handler: async (ctx, args) => {
    const { internal } = (await import("../../_generated/api")) as any;
    const tokens: { expoPushToken: string }[] = await ctx.runQuery(
      internal.functions.push.index._getEnabledOrgTokens,
      {
        clerkOrganizationId: args.clerkOrganizationId,
      }
    );

    if (tokens.length === 0) {
      return { status: "no_targets" as const };
    }

    const results: any[] = [];
    for (const t of tokens) {
      try {
        results.push(
          await sendExpoPush({
            token: t.expoPushToken,
            title: "Appointment reminder",
            body: `${args.appointmentTitle} • ${args.appointmentWhen}`,
          })
        );
      } catch (e: any) {
        results.push({ error: e?.message || "send failed" });
      }
    }

    return { status: "sent" as const, results };
  },
});
