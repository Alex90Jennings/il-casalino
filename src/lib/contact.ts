// Contact-form validation and email composition. Framework-free (no DOM, no
// React, no env) so the server action and the test suite share one source.

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  locale: string;
}

export type ContactParse =
  | { kind: "ok"; value: ContactMessage }
  | { kind: "spam" }
  | { kind: "invalid" };

const LIMITS = { name: 100, email: 200, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field = (fields: Record<string, unknown>, key: string) =>
  typeof fields[key] === "string" ? (fields[key] as string).trim() : "";

export function parseContact(fields: Record<string, unknown>): ContactParse {
  // Honeypot: hidden from people, so only bots fill it. They get a fake success.
  if (field(fields, "website")) return { kind: "spam" };

  const name = field(fields, "name");
  const email = field(fields, "email");
  const message = field(fields, "message");
  const locale = field(fields, "locale") === "en" ? "en" : "it";

  if (!name || name.length > LIMITS.name) return { kind: "invalid" };
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) return { kind: "invalid" };
  if (!message || message.length > LIMITS.message) return { kind: "invalid" };

  return { kind: "ok", value: { name, email, message, locale } };
}

export function contactSubject({ name }: Pick<ContactMessage, "name">): string {
  return `Website enquiry — ${name}`;
}

export function contactBody(m: ContactMessage): string {
  return [
    `From: ${m.name} <${m.email}>`,
    `Site language: ${m.locale.toUpperCase()}`,
    "",
    m.message,
  ].join("\n");
}
