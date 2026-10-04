// Contact-form rate limiting: the fixed window allows `limit` hits, then refuses
// with a Retry-After inside the window. Exercises src/lib/rate-limit.ts via tsx.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function run(input) {
  const tsx = path.join(root, "node_modules/.bin/tsx");
  return JSON.parse(execFileSync(tsx, ["scripts/dump-rate-limit.ts", JSON.stringify(input)], { cwd: root }).toString());
}

test("allows up to the limit, then refuses with a retry inside the window", () => {
  const results = run({ limit: 3, windowSeconds: 600, hits: 5 });
  assert.deepEqual(results.map((r) => r.allowed), [true, true, true, false, false]);
  for (const r of results.slice(3)) assert.ok(r.retryAfter > 0 && r.retryAfter <= 600);
});

test("the server action limits per visitor before verifying or sending", () => {
  const src = readFileSync(path.join(root, "src/lib/contact-action.ts"), "utf8");
  const limited = src.indexOf("checkRateLimits(PER_VISITOR");
  assert.ok(limited > 0 && limited < src.indexOf("verifyTurnstile(") && limited < src.indexOf("api.resend.com"));
  assert.ok(/createHash\("sha256"\)/.test(src), "visitor IPs are hashed before use as keys");
});
