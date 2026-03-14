"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-cream py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <SectionHeading title={t.about.heading} />
        <p className="text-charcoal/75 leading-relaxed text-base md:text-lg font-light">
          {t.about.body}
        </p>
      </div>
    </section>
  );
}
