import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL as BASE_URL } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Il Casino Casalino — Bed & Breakfast tradizionale a Francavilla Fontana, Puglia",
    template: "%s | Il Casino Casalino",
  },
  description:
    "Bed & breakfast tradizionale nel cuore della Puglia. Il Casino Casalino a Francavilla Fontana (Brindisi): camere con colazione, piscina e giardino per un soggiorno autentico tra storia e natura — ideale per il turismo in Salento e Valle d'Itria.",
  keywords: [
    "bed and breakfast francavilla fontana",
    "b&b francavilla fontana",
    "bed and breakfast puglia",
    "b&b puglia",
    "b&b brindisi",
    "il casino casalino",
    "soggiorno tradizionale puglia",
    "turismo puglia",
    "turismo francavilla fontana",
    "vacanze in puglia",
    "cosa vedere a francavilla fontana",
    "dove dormire a francavilla fontana",
    "casa di charme puglia",
    "affittacamere francavilla fontana",
  ],
  authors: [{ name: "Il Casino Casalino" }],
  creator: "Il Casino Casalino",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Il Casino Casalino — Bed & Breakfast tradizionale in Puglia",
    description:
      "B&B tradizionale a Francavilla Fontana, nel cuore della Puglia. Camere con colazione, piscina e giardino per un soggiorno autentico.",
    url: BASE_URL,
    siteName: "Il Casino Casalino",
    locale: "it_IT",
    alternateLocale: "en_GB",
    type: "website",
    images: [
      {
        url: "/media/images/gate-entrance-1600.webp",
        width: 1600,
        height: 1067,
        alt: "Il portale d'ingresso di Il Casino Casalino, Francavilla Fontana, Puglia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Il Casino Casalino — Bed & Breakfast, Francavilla Fontana",
    description:
      "Un rifugio autentico nel cuore della Puglia. B&B a Francavilla Fontana, Brindisi.",
    images: ["/media/images/gate-entrance-1600.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream text-charcoal antialiased">
        <JsonLd />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
