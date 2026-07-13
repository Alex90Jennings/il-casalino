import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { LOCALES, type Locale } from "@/lib/locales";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL as BASE_URL } from "@/lib/site";

// Only /it and /en are valid; anything else 404s (→ redirected to /it).
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const LOCALE_META: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  it: {
    title: "Il Casino Casalino — B&B a Francavilla Fontana, Puglia",
    description:
      "Bed & breakfast tradizionale a Francavilla Fontana (Brindisi), nel cuore della Puglia. Camere con colazione, piscina e giardino per un soggiorno autentico.",
    ogLocale: "it_IT",
  },
  en: {
    title: "Il Casino Casalino — B&B in Francavilla Fontana, Puglia",
    description:
      "Traditional bed & breakfast in Francavilla Fontana (Brindisi), in the heart of Puglia. Rooms with breakfast, pool and garden for an authentic stay.",
    ogLocale: "en_GB",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = locale === "en" ? "en" : "it";
  const meta = LOCALE_META[l];
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${l}`,
      languages: {
        it: `${BASE_URL}/it`,
        en: `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/it`,
      },
    },
    openGraph: {
      url: `${BASE_URL}/${l}`,
      locale: meta.ogLocale,
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();

  return (
    <>
      <JsonLd />
      <LanguageProvider locale={locale as Locale}>{children}</LanguageProvider>
    </>
  );
}
