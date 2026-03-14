"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  breakfast: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707" />
      <circle cx="12" cy="12" r="4" strokeLinecap="round" />
    </svg>
  ),
  garden: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0C12 9 9 6 5 6c0 4 3 7 7 7zm0 0c0-4 3-7 7-7 0 4-3 7-7 7z" />
    </svg>
  ),
  wifi: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  ),
  parking: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
      <path strokeLinecap="round" d="M9 17V7h4a3 3 0 010 6H9" />
    </svg>
  ),
  checkin: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  local: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};

const SERVICE_KEYS = ["breakfast", "garden", "wifi", "parking", "checkin", "local"] as const;

export function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title={t.services.heading} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {SERVICE_KEYS.map((key) => (
            <div key={key} className="text-center">
              <div className="flex justify-center mb-3 text-stone">
                {SERVICE_ICONS[key]}
              </div>
              <h3 className="font-serif text-lg font-light text-charcoal mb-2">
                {t.services[key].title}
              </h3>
              <p className="text-sm text-charcoal/60 leading-relaxed font-light">
                {t.services[key].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
