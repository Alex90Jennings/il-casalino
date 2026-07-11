"use client";

import { useLanguage } from "@/context/LanguageContext";
import { HoliduWidget } from "@/components/booking/HoliduWidget";
// Custom PayPal BookingWidget is preserved below — uncomment to reactivate direct booking
// import { BookingWidget } from "@/components/booking/BookingWidget";

export function BookingSection() {
  const { t, locale } = useLanguage();

  return (
    <section id="booking" className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.booking.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto mb-5" />
          <p className="text-sm font-light text-stone tracking-[0.06em]">
            {t.booking.subtitle}
          </p>
        </div>

        {/* Primary booking interface — Holidu widget */}
        <HoliduWidget
          locale={locale}
          title={t.booking.widgetTitle}
          fallbackLabel={t.booking.openInNewTab}
        />

        {/* Custom PayPal booking widget — preserved for reactivation */}
        {/* <BookingWidget /> */}
      </div>
    </section>
  );
}
