"use client";

import { useLanguage } from "@/context/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="hero" className="bg-cream pt-14">
      {/* Brand lockup — sits directly below the fixed nav */}
      <div className="text-center px-6 pt-10 pb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
          {t.hero.tagline}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-[0.12em] text-charcoal uppercase mb-3">
          Il Casino Casalino
        </h1>
        {/* Reference-style em-dash decorative subtitle */}
        <p className="text-sm font-serif italic text-stone tracking-wide">
          — Bed &amp; Breakfast —
        </p>
      </div>

      {/* Contained hero image — content, not background */}
      <div className="relative w-full aspect-[16/7] md:aspect-[21/8] overflow-hidden bg-stone/10">
        {/* Replace with real image — this div acts as the image container */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero.jpg')" }}
          role="img"
          aria-label="Il Casino Casalino"
        />
        {/* Very subtle bottom fade to blend into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream/40 to-transparent" />
      </div>
    </section>
  );
}
