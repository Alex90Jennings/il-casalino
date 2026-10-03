"use client";

import { useActionState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sendContact, type ContactState } from "@/lib/contact-action";

const INPUT =
  "w-full bg-transparent border-b border-stone-light/70 py-2.5 text-sm text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-stone transition-colors";
const LABEL = "block text-[10px] tracking-[0.2em] uppercase text-stone mb-1";

export function ContactForm() {
  const { t, locale } = useLanguage();
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const f = t.contactForm;

  if (state.status === "success") {
    return (
      <p role="status" className="text-center text-sm text-charcoal/75 font-light py-8">
        {f.success}
      </p>
    );
  }

  return (
    <form action={action} className="max-w-xl mx-auto space-y-6">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot — off-screen and skipped by keyboard/screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={LABEL}>{f.name}</label>
          <input id="contact-name" name="name" required maxLength={100} autoComplete="name" className={INPUT} />
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL}>{f.email}</label>
          <input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" className={INPUT} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className={LABEL}>{f.message}</label>
        <textarea id="contact-message" name="message" required maxLength={5000} rows={5} className={`${INPUT} resize-y`} />
      </div>

      {(state.status === "invalid" || state.status === "failed") && (
        <p role="alert" className="text-xs text-red-800/80 text-center">
          {state.status === "invalid" ? f.invalid : f.failed}
        </p>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={pending}
          className="text-[11px] tracking-[0.2em] uppercase bg-charcoal text-white px-8 py-3 hover:bg-nav disabled:opacity-60 transition-colors"
        >
          {pending ? f.sending : f.send}
        </button>
      </div>
    </form>
  );
}
