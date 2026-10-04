"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const VAT_NUMBER = "08684360723";

export function Footer() {
  const { t, locale } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-charcoal text-white/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-center">
        <p className="text-xs tracking-wide text-center">
          {t.footer.rights.replace("{{year}}", String(year))}
          <span className="mx-2" aria-hidden="true">·</span>
          {t.footer.vat.replace("{{vat}}", VAT_NUMBER)}
          <span className="mx-2" aria-hidden="true">·</span>
          <Link href={`/${locale}/privacy`} className="underline underline-offset-4 decoration-white/30 hover:text-white transition-colors">
            {t.footer.privacy}
          </Link>
        </p>
      </div>
    </footer>
  );
}
