"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { HOST_IMAGE } from "@/data/media";

export function AboutSection() {
  const { t, locale } = useLanguage();

  return (
    <section id="about" className="bg-cream py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-7">
          {t.host.heading}
        </h2>
        <div className="mx-auto mb-7 w-36 h-36 md:w-44 md:h-44 rounded-full p-1.5 ring-1 ring-stone-light/60">
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-sm">
            <Image
              src={HOST_IMAGE.src}
              alt={HOST_IMAGE.alt[locale]}
              fill
              className="object-cover object-[22%_56%]"
              sizes="(min-width: 768px) 176px, 144px"
            />
          </div>
        </div>
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
