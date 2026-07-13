"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-charcoal text-white/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-center">
        <p className="text-xs tracking-wide text-center">
          {t.footer.rights.replace("{{year}}", String(year))}
        </p>
      </div>
    </footer>
  );
}
