"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingWidget } from "@/components/booking/BookingWidget";

export function BookingSection() {
  const { t } = useLanguage();

  return (
    <section id="booking" className="bg-cream py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading
          title={t.booking.heading}
          subtitle={t.booking.subtitle}
        />
        <BookingWidget />
      </div>
    </section>
  );
}
