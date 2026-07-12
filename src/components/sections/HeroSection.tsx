"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { HERO_IMAGE } from "@/data/media";

export function HeroSection() {
  const { locale } = useLanguage();

  return (
    <section id="hero" className="bg-cream pt-14">
      {/* Brand lockup */}
      <div className="text-center px-6 pt-10 pb-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Il Casino Casalino"
            width={56}
            height={56}
            className="opacity-55 w-12 h-12 md:w-14 md:h-14"
            priority
          />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-[0.12em] text-charcoal uppercase mb-3">
          Il Casino Casalino B&amp;B
        </h1>
        <p className="text-xl md:text-2xl font-serif italic text-stone/80 tracking-[0.12em]">
          Francavilla Fontana, Puglia
        </p>
      </div>

      {/* Contained hero image with subtle edge vignette */}
      <div className="relative w-full aspect-[16/7] md:aspect-[21/8] overflow-hidden">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt[locale]}
          fill
          className="object-cover object-center"
          priority
          fetchPriority="high"
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
