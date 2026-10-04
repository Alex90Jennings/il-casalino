// Drives the real rate limiter's in-memory path (no Upstash) so the test suite
// can assert the window behaviour. Not a test file.
// Input:  argv[2] = JSON { limit, windowSeconds, hits }
// Output: JSON array of { allowed, retryAfter }, one per hit, all from one subject.
import { checkRateLimits } from "../src/lib/rate-limit";

const { limit, windowSeconds, hits } = JSON.parse(process.argv[2] ?? "{}");
const rule = { name: "test:contact", limit, windowSeconds };

(async () => {
  const results = [];
  for (let i = 0; i < hits; i++) results.push(await checkRateLimits([rule], "visitor", null));
  process.stdout.write(JSON.stringify(results));
})();
