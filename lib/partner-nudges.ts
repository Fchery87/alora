export type PartnerNudge = {
  id: string;
  title: string;
  message: string;
  kind: "load_balance";
};

export type FeedEntry = {
  startTime: number;
  createdById: string;
};

function isNightHour(date: Date) {
  const hour = date.getHours();
  return hour >= 22 || hour < 6;
}

export function computePartnerNudges(params: {
  feeds: FeedEntry[] | null | undefined;
  now: Date;
}): PartnerNudge[] {
  const feeds = params.feeds ?? [];
  const nowMs = params.now.getTime();
  const sinceMs = nowMs - 24 * 60 * 60 * 1000;

  const nightFeeds = feeds.filter((f) => {
    if (typeof f?.startTime !== "number") return false;
    if (f.startTime < sinceMs || f.startTime > nowMs) return false;
    return isNightHour(new Date(f.startTime));
  });

  if (nightFeeds.length < 3) return [];

  const counts = new Map<string, number>();
  for (const f of nightFeeds) {
    counts.set(f.createdById, (counts.get(f.createdById) ?? 0) + 1);
  }

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const topCount = top?.[1] ?? 0;

  if (topCount < 3) return [];

  return [
    {
      id: `nudge-night-feeds-${params.now.toISOString().slice(0, 10)}`,
      kind: "load_balance",
      title: "Share the load",
      message:
        "There have been several night feeds logged in the last 24 hours. If you can, consider swapping who handles the next shift so one person can rest.",
    },
  ];
}

export function shouldShowPartnerNudge(params: {
  nudgeId: string;
  nowMs: number;
  mutedUntilMs: number | null;
  lastShownAtMs: number | null;
  cooldownMs: number;
}): boolean {
  if (params.mutedUntilMs && params.nowMs < params.mutedUntilMs) return false;
  if (!params.lastShownAtMs) return true;
  return params.nowMs - params.lastShownAtMs >= params.cooldownMs;
}
