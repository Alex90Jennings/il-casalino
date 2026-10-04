import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";
import { SITE_URL as BASE_URL } from "@/lib/site";
import { privacyIt } from "@/translations/privacy-it";
import { privacyEn } from "@/translations/privacy-en";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale === "en" ? "en" : "it";
  const p = l === "en" ? privacyEn : privacyIt;
  return {
    title: { absolute: `${p.metaTitle} | Il Casino Casalino` },
    description: p.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/${l}/privacy`,
      languages: {
        it: `${BASE_URL}/it/privacy`,
        en: `${BASE_URL}/en/privacy`,
        "x-default": `${BASE_URL}/it/privacy`,
      },
    },
    openGraph: { url: `${BASE_URL}/${l}/privacy`, title: p.metaTitle, description: p.metaDescription },
  };
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream">
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}
