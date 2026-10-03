// Runs the real contact-form parser and subject builder over a batch of field
// sets so the test suite can assert behaviour. Not a test file.
// Input:  argv[2] = JSON array of form-field objects
// Output: JSON array of { kind, subject? }, one per case.
import { contactSubject, parseContact } from "../src/lib/contact";

const cases: Record<string, unknown>[] = JSON.parse(process.argv[2] ?? "[]");
process.stdout.write(
  JSON.stringify(
    cases.map((fields) => {
      const r = parseContact(fields);
      return r.kind === "ok" ? { kind: r.kind, subject: contactSubject(r.value) } : { kind: r.kind };
    }),
  ),
);
