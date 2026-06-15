import { useState, useEffect } from "react";
import type { PublicMetrics } from "../types/metrics";

const API_URL = import.meta.env.VITE_API_URL;


export function useMetricsStream() {
  const [metrics, setMetrics] = useState<PublicMetrics | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource(`${API_URL}/metrics/stream`);

    es.onopen = () => {
      setConnected(true);
    };

    es.onmessage = (event) => {
      try {
        const data: PublicMetrics = JSON.parse(event.data);
        setMetrics(data);
      } catch (e) {
        console.error("Failed to Parse SSE payload", e);
      }
    };

    es.onerror = () => {
      setConnected(false);
    };

    return () => {
      es.close();
    };
  }, []);

  return { metrics, connected };
}



