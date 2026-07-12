"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-charcoal text-white/60">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-white text-sm tracking-[0.15em] uppercase mb-3">
              Il Casino Casalino
            </p>
            <p className="text-xs leading-relaxed">
              Contrada Casalino, 18, 72021, Francavilla Fontana BR, Italy
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white text-xs tracking-widest uppercase mb-3">
              {t.contact.heading}
            </p>
            <p className="text-xs mb-1">+393277755170</p>
            <p className="text-xs">ilcasinocasalino@gmail.com</p>
          </div>

          {/* Links placeholder */}
          <div className="flex flex-col gap-2 text-xs">
            <button className="text-left hover:text-white transition-colors">
              {t.footer.privacy}
            </button>
            <button className="text-left hover:text-white transition-colors">
              {t.footer.cookie}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-center">
            {t.footer.rights.replace("{{year}}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
