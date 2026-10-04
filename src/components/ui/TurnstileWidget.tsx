"use client";

import { useEffect, useRef } from "react";

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptLoading: Promise<TurnstileApi> | null = null;

// Explicit rendering rather than the script's auto-scan: the form remounts on
// client-side locale changes, after which an auto-scan would never run again.
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
    script.onerror = () => {
      scriptLoading = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptLoading;
}

// Renders the Turnstile challenge inside the surrounding form; Cloudflare adds a
// hidden `cf-turnstile-response` input that the server action verifies. Tokens
// are single use, so a new `resetSignal` value fetches a fresh one.
export function TurnstileWidget({ siteKey, language, resetSignal }: { siteKey: string; language: string; resetSignal: unknown }) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return;
        widgetId.current = turnstile.render(container.current, {
          sitekey: siteKey,
          action: "contact",
          language,
          appearance: "interaction-only",
        });
      })
      .catch((err) => console.warn(err));
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey, language]);

  useEffect(() => {
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetSignal]);

  return <div ref={container} className="flex justify-center empty:hidden" />;
}
