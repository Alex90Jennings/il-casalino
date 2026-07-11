"use client";

import { useLanguage } from "@/context/LanguageContext";
import { HoliduWidget } from "@/components/booking/HoliduWidget";

export function BookingSection() {
  const { t, locale } = useLanguage();

  return (
    <section id="booking" className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.booking.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto" />
        </div>

        {/* Primary booking interface — Holidu widget */}
        <HoliduWidget
          locale={locale}
          title={t.booking.widgetTitle}
          fallbackLabel={t.booking.openInNewTab}
        />
      </div>
    </section>
  );
}
