"use client";

import { createContext, useContext, useEffect, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { it } from "@/translations/it";
import { en } from "@/translations/en";
import type { Translations } from "@/translations/it";
import type { Locale } from "@/lib/locales";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/lib/locale-detection";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  /** Switch language by navigating to the other locale's route (/it ↔ /en). */
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const translations: Record<Locale, Translations> = { it, en };

// The active locale is driven by the route (/[locale]), not client state.
export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Keep <html lang> in sync with the routed locale (the root layout renders a
  // static default; this corrects it on the client after navigation).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const toggle = useCallback(() => {
    const next: Locale = locale === "it" ? "en" : "it";

    // Persist the manual choice so future visits to "/" honour it. Written as a
    // plain (non-HttpOnly) cookie by design: the middleware must read it, it holds
    // no sensitive data, and it takes priority over browser detection. `secure`
    // only over HTTPS so local http:// development still works.
    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax${secure}`;

    // Preserve the current page — swap only the leading locale segment, keeping
    // any sub-path and query string. Falls back to the locale root if absent.
    const rest = pathname.replace(/^\/(it|en)(?=\/|$)/, "");
    router.push(`/${next}${rest}${window.location.search}`, { scroll: false });
  }, [locale, pathname, router]);

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
