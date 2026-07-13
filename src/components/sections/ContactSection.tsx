"use client";

import { useLanguage } from "@/context/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="bg-cream py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.contact.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto" />
        </div>

        {/* Info strip — centered, like the reference */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 text-center">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1.5">
              {t.contact.email}
            </p>
            <a
              href="mailto:ilcasinocasalino@gmail.com"
              className="text-xs text-charcoal/75 hover:text-charcoal transition-colors"
            >
              ilcasinocasalino@gmail.com
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1.5">
              {t.contact.address}
            </p>
            <p className="text-xs text-charcoal/75 leading-relaxed max-w-[200px] mx-auto">
              Contrada Casalino, 18, 72021, Francavilla Fontana BR, Italy
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1.5">
              {t.contact.phone}
            </p>
            <a
              href="tel:+393277755170"
              className="text-xs text-charcoal/75 hover:text-charcoal transition-colors"
            >
              +393277755170
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
