import { useEffect, useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toLocalISODateString } from "@/lib/dates";

type DailyInsight = { id: string; title: string; message: string } | null;

export function useAiInsightSettings() {
  const settings = useQuery(api.functions.insights.index.getAiInsightSettings);
  const setEnabled = useMutation(
    api.functions.insights.index.setAiInsightsEnabled
  );
  return { settings, setEnabled };
}

export function useDailyInsight(enabled: boolean) {
  const date = useMemo(() => toLocalISODateString(new Date()), []);
  const generate = useAction(api.functions.insights.index.generateDailyInsight);

  const [data, setData] = useState<DailyInsight>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setData(null);

    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void (async () => {
      try {
        const res = await generate({ date });
        if (cancelled) return;
        if (
          res &&
          typeof (res as any)._id === "string" &&
          typeof (res as any).title === "string" &&
          typeof (res as any).message === "string"
        ) {
          setData({
            id: (res as any)._id,
            title: (res as any).title,
            message: (res as any).message,
          });
        } else {
          setData(null);
        }
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Failed to generate insight");
        setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, generate, date]);

  return { data, isLoading, error, date };
}
