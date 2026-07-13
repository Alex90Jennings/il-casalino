"use client";

import { useLanguage } from "@/context/LanguageContext";

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-cream py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
          {t.host.heading}
        </h2>
        <div className="w-8 h-px bg-stone-light mx-auto mb-7" />
        <p className="font-serif italic text-lg md:text-xl text-charcoal/80 tracking-[0.04em] mb-6">
          {t.host.intro}
        </p>
        <div className="space-y-5 text-charcoal/70 leading-loose text-sm md:text-base font-light">
          {t.host.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
