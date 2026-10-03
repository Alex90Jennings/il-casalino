"use server";

import { contactBody, contactSubject, parseContact } from "@/lib/contact";

export type ContactState = { status: "idle" | "success" | "invalid" | "failed" };

// The only server code in the project, and the only place env vars are read:
// the Resend API key is a secret, so unlike every other value it can't be a
// literal in source. Set the three variables in Vercel as well as .env.
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = parseContact(Object.fromEntries(formData));
  if (parsed.kind === "spam") return { status: "success" };
  if (parsed.kind === "invalid") return { status: "invalid" };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("Contact form: RESEND_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL is not set");
    return { status: "failed" };
  }

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
