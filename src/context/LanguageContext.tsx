"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { it } from "@/translations/it";
import { en } from "@/translations/en";
import type { Translations } from "@/translations/it";

type Locale = "it" | "en";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const translations: Record<Locale, Translations> = { it, en };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("it");

  const toggle = useCallback(() => {
    setLocale((l) => (l === "it" ? "en" : "it"));
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale, t: translations[locale], toggle }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
