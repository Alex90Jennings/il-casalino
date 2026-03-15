"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BookingWidget } from "@/components/booking/BookingWidget";

export function BookingSection() {
  const { t } = useLanguage();

  return (
    <section id="booking" className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.booking.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto mb-4" />
          <p className="text-xs tracking-[0.08em] text-stone">
            {t.booking.subtitle}
          </p>
        </div>

        <BookingWidget />
      </div>
    </section>
  );
}
