"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { contactBody, contactSubject, parseContact } from "@/lib/contact";
import { checkRateLimits, type RateLimitRule } from "@/lib/rate-limit";
import { turnstileSiteKey, verifyTurnstile } from "@/lib/turnstile";

export type ContactState = { status: "idle" | "success" | "invalid" | "failed" | "limited" | "challenge" };

const PER_VISITOR: readonly RateLimitRule[] = [
  { name: "casalino:contact:ip:10m", limit: 3, windowSeconds: 10 * 60 },
  { name: "casalino:contact:ip:day", limit: 10, windowSeconds: 24 * 60 * 60 },
];
// Site-wide ceiling, so a flood from many IPs can't burn the Resend quota.
const SITE_WIDE: readonly RateLimitRule[] = [{ name: "casalino:contact:all:day", limit: 100, windowSeconds: 24 * 60 * 60 }];

// The only server code in the project, and the only place env vars are read:
// these are secrets, so unlike every other value they can't be literals in
// source. Set them in Vercel as well as .env.
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const fields = Object.fromEntries(formData);
  const parsed = parseContact(fields);
  if (parsed.kind === "spam") return { status: "success" };
  if (parsed.kind === "invalid") return { status: "invalid" };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const upstash =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }
      : null;

  // Vercel sets x-forwarded-for itself; the IP is only ever stored hashed.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const visitor = createHash("sha256").update(ip ?? "unknown").digest("hex").slice(0, 32);
  if (!(await checkRateLimits(PER_VISITOR, visitor, upstash)).allowed) return { status: "limited" };

  // With the widget on, a missing secret would let every bot through — fail closed.
  if (!apiKey || !from || !to || (turnstileSiteKey() && !turnstileSecret)) {
    console.error("Contact form: RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL or TURNSTILE_SECRET_KEY is not set");
    return { status: "failed" };
  }
  if (turnstileSecret) {
    const token = fields["cf-turnstile-response"];
    if (!(await verifyTurnstile(turnstileSecret, typeof token === "string" ? token : "", ip))) {
      return { status: "challenge" };
    }
  }
  if (!(await checkRateLimits(SITE_WIDE, "site", upstash)).allowed) return { status: "limited" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: parsed.value.email,
      subject: contactSubject(parsed.value),
      text: contactBody(parsed.value),
    }),
  });
  if (!res.ok) {
    console.error(`Contact form: Resend responded ${res.status}`, await res.text());
    return { status: "failed" };
  }
  return { status: "success" };
}
