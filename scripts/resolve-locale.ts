// Runs the real server-side locale resolver over a batch of cases so the test
// suite can assert actual behaviour (not just source patterns). Not a test file.
// Input:  argv[2] = JSON array of { cookie?, header? }
// Output: JSON array of resolved locales ("it" | "en"), one per case.
import { resolveLocale } from "../src/lib/locale-detection";

interface Case {
  cookie?: string | null;
  header?: string | null;
}

const cases: Case[] = JSON.parse(process.argv[2] ?? "[]");
process.stdout.write(
  JSON.stringify(cases.map((c) => resolveLocale(c.cookie ?? null, c.header ?? null))),
);
