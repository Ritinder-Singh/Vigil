


export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}


// Crude % for network throughput display — scale against an assumed
// link ceiling. Adjust NETWORK_MAX_MBPS to match your actual VPS plan.

const NETWORK_MAX_MBPS = 12.5;

export function networkPercent(inMbps: number, outMbps: number): number {
  const total = inMbps + outMbps;
  return Math.min(100, (total / NETWORK_MAX_MBPS) * 100);
}
