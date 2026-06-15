import { useState, useEffect } from "react";
import type { PrivateMetrics } from "../types/metrics";

const API_URL = import.meta.env.VITE_API_URL;

export function usePrivateMetricsStream(enabled: boolean) {
  const [metrics, setMetrics] = useState<PrivateMetrics | null>(null);
  const [connected, setConnected] = useState(false);



  useEffect(() => {
    if (!enabled) {
      setMetrics(null);
      setConnected(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      try {
        const res = await fetch(`${API_URL}/metrics/private/stream`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setConnected(false);
          return;
        }

        setConnected(true);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!cancelled) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part.trim();
            if (line.startsWith("data:")) {
              const jsonStr = line.slice(5).trim();
              try {
                const data: PrivateMetrics = JSON.parse(jsonStr);
                if (!cancelled) setMetrics(data);
              } catch (e) {
                console.error("Failed to parse private SSE payload", e);
              }
            }
          }
        }
      } catch (e) {
        if (!cancelled) setConnected(false);
      } finally {
        if (!cancelled) setConnected(false);
      }
    }

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled]);



  return { metrics, connected };
}




