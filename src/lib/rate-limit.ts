// Fixed-window rate limiting for the contact form. Framework-free and env-free:
// the caller passes the Upstash credentials, so the test suite can drive the
// in-memory fallback directly.

export interface RateLimitRule {
  /** Redis key prefix, e.g. "casalino:contact:ip:10m". */
  name: string;
  limit: number;
  windowSeconds: number;
}

export interface UpstashConfig {
  url: string;
  token: string;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the tightest exceeded window resets. */
  retryAfter: number;
}

type Hit = { count: number; ttl: number };

// Local development, or Redis unreachable. On Vercel each instance has its own
// map, so this is a weak limit — Upstash is what makes it hold across instances.
const memory = new Map<string, { count: number; resetAt: number }>();

export function memoryHit(key: string, windowSeconds: number, now = Date.now()): Hit {
  let entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowSeconds * 1000 };
    memory.set(key, entry);
  }
  entry.count += 1;
  if (memory.size > 10_000) {
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  }
  return { count: entry.count, ttl: Math.ceil((entry.resetAt - now) / 1000) };
}

async function upstashHit(upstash: UpstashConfig, key: string, windowSeconds: number): Promise<Hit> {
  const res = await fetch(`${upstash.url.replace(/\/+$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${upstash.token}`, "Content-Type": "application/json" },
    // INCR, then start the window only on the first hit (NX), then read what's left of it.
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(windowSeconds), "NX"],
      ["TTL", key],
    ]),
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const [incr, , ttl] = (await res.json()) as { result?: number; error?: string }[];
  if (typeof incr?.result !== "number") throw new Error(incr?.error ?? "unexpected Upstash response");
  return { count: incr.result, ttl: Math.max(1, ttl?.result ?? windowSeconds) };
}

// Counts one hit against every rule. If Redis fails we fall back to memory rather
// than turn real guests away — Turnstile still guards the form.
export async function checkRateLimits(
  rules: readonly RateLimitRule[],
  subject: string,
  upstash: UpstashConfig | null,
): Promise<RateLimitResult> {
  let retryAfter = 0;
  for (const rule of rules) {
    const key = `${rule.name}:${subject}`;
    let hit: Hit;
    try {
      hit = upstash ? await upstashHit(upstash, key, rule.windowSeconds) : memoryHit(key, rule.windowSeconds);
    } catch (err) {
      console.warn(`Contact form: Redis unavailable, using in-memory limits (${(err as Error).message})`);
      hit = memoryHit(key, rule.windowSeconds);
    }
    if (hit.count > rule.limit) retryAfter = Math.max(retryAfter, hit.ttl);
  }
  return { allowed: retryAfter === 0, retryAfter };
}
