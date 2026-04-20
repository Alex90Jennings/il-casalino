"use client";

import { useLanguage } from "@/context/LanguageContext";
// BookingWidget is preserved below — uncomment to reactivate direct booking
// import { BookingWidget } from "@/components/booking/BookingWidget";

export function BookingSection() {
  const { t } = useLanguage();

  return (
    <section id="booking" className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.booking.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto" />
        </div>

        {/* Coming soon panel */}
        <div className="max-w-lg mx-auto text-center py-10 px-8 border border-stone-light/40">
          <p className="font-serif text-xl font-light tracking-[0.06em] text-charcoal mb-4">
            {t.booking.comingSoonHeading}
          </p>
          <p className="text-sm font-light text-stone leading-relaxed tracking-[0.04em]">
            {t.booking.comingSoonBody}
          </p>
        </div>

        {/* Full booking widget — preserved for reactivation */}
        {/* <BookingWidget /> */}
      </div>
    </section>
  );
}
