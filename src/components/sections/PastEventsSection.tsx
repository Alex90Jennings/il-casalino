"use client";

import { useLanguage } from "@/context/LanguageContext";
import { MediaCarousel } from "@/components/ui/MediaCarousel";
import { YOGA_EVENT_GALLERY } from "@/data/media";

export function PastEventsSection() {
  const { t } = useLanguage();
  const yoga = t.events.yoga;

  return (
    <section id="events" className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="text-center mb-12 px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
          {t.events.heading}
        </h2>
        <div className="w-8 h-px bg-stone-light mx-auto mb-5" />
        <p className="text-sm text-charcoal/60 font-light">{t.events.intro}</p>
      </div>

      <article>
        <header className="text-center mb-8 px-6">
          <h3 className="font-serif text-xl md:text-2xl font-light tracking-[0.06em] text-charcoal mb-2">
            {yoga.title}
          </h3>
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone">{yoga.date}</p>
        </header>
        <MediaCarousel items={YOGA_EVENT_GALLERY} shape="portrait" />
        <div className="max-w-2xl mx-auto px-6 mt-10 space-y-5 text-center text-charcoal/70 leading-loose text-sm md:text-base font-light">
          {yoga.summary.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </section>
  );
}
