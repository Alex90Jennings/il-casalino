"use client";

import { useLanguage } from "@/context/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex flex-col items-center justify-center bg-charcoal overflow-hidden"
    >
      {/* Background image placeholder — replace src with real hero image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-4">
          {t.hero.tagline}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-light text-white tracking-wide mb-4">
          Il Casino Casalino
        </h1>
        <p className="text-white/80 text-sm md:text-base tracking-wider font-light mb-10">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollTo("about")}
            className="px-8 py-3 border border-white/50 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-charcoal transition-all duration-300"
          >
            {t.hero.cta}
          </button>
          <button
            onClick={() => scrollTo("booking")}
            className="px-8 py-3 bg-white text-charcoal text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-all duration-300"
          >
            {t.hero.bookCta}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}
