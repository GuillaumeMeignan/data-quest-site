/**
 * Simple in-memory limiter, per server instance. Good enough as a first barrier;
 * replace with a shared store (e.g. Upstash/Vercel KV) if abuse appears in production.
 */
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

export function getRateLimit(): number {
  const n = Number(process.env.LEAD_RATE_LIMIT);
  return Number.isFinite(n) && n > 0 ? n : 5;
}

export function isRateLimited(key: string, now = Date.now(), limit = getRateLimit()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

export function resetRateLimit() {
  hits.clear();
}
