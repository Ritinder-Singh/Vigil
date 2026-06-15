import { useState, useEffect } from "react";
import type { PublicMetrics } from "../types/metrics";

const API_URL = import.meta.env.VITE_API_URL

export function useMetrics() {
  const [metrics, setMetrics] = useState<PublicMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMetrics() {
      try {
        const res = await fetch(`${API_URL}/metrics/snapshot`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PublicMetrics = await res.json();
        if (!cancelled) {
          setMetrics(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown Error");
      }
    }


    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);


  return { metrics, error };

}



