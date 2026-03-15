import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { JsonLd } from "@/components/seo/JsonLd";

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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ilcasinocasalino.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Il Casino Casalino — Bed & Breakfast, Francavilla Fontana",
    template: "%s | Il Casino Casalino",
  },
  description:
    "Un rifugio autentico nel cuore della Puglia. Bed & Breakfast a Francavilla Fontana, Brindisi — camere con colazione, giardino e terrazza.",
  keywords: [
    "bed and breakfast francavilla fontana",
    "b&b puglia",
    "b&b brindisi",
    "il casino casalino",
    "casalino francavilla fontana",
    "bed and breakfast puglia",
    "soggiorno puglia",
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
    title: "Il Casino Casalino — Bed & Breakfast",
    description:
      "Un rifugio autentico nel cuore della Puglia. B&B a Francavilla Fontana, Brindisi — camere con colazione, giardino e terrazza.",
    url: BASE_URL,
    siteName: "Il Casino Casalino",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/images/drawing-room3.webp",
        width: 1200,
        height: 630,
        alt: "Il Casino Casalino — Il Salone, Francavilla Fontana, Puglia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Il Casino Casalino — Bed & Breakfast, Francavilla Fontana",
    description:
      "Un rifugio autentico nel cuore della Puglia. B&B a Francavilla Fontana, Brindisi.",
    images: ["/images/drawing-room3.webp"],
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
