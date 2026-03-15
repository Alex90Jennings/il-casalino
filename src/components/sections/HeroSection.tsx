"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="hero" className="bg-cream pt-14">
      {/* Brand lockup */}
      <div className="text-center px-6 pt-10 pb-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Il Casino Casalino"
            width={32}
            height={32}
            className="opacity-55"
            priority
          />
        </div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
          {t.hero.tagline}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-[0.12em] text-charcoal uppercase mb-3">
          Il Casino Casalino
        </h1>
        <p className="text-xs font-serif italic text-stone/80 tracking-[0.12em]">
          Francavilla Fontana, Puglia
        </p>
      </div>

      {/* Contained hero image with subtle edge vignette */}
      <div className="relative w-full aspect-[16/7] md:aspect-[21/8] overflow-hidden">
        <Image
          src="/images/profile.webp"
          alt="Il Casino Casalino — cortile esterno"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Subtle radial edge vignette — richens the image without darkening the center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.18) 100%)",
          }}
        />
        {/* Soft bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream/35 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
