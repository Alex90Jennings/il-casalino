import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

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
  title: "Il Casino Casalino — Bed & Breakfast",
  description:
    "Un rifugio autentico nel cuore della Puglia. Bed & Breakfast a Francavilla Fontana, Brindisi.",
  keywords: ["bed and breakfast", "puglia", "francavilla fontana", "casalino", "b&b"],
  openGraph: {
    title: "Il Casino Casalino — Bed & Breakfast",
    description: "Un rifugio autentico nel cuore della Puglia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream text-charcoal antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
