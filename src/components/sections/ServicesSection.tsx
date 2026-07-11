"use client";

import { useLanguage } from "@/context/LanguageContext";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  breakfast: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  garden: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0C12 9 9 6 5 6c0 4 3 7 7 7zm0 0c0-4 3-7 7-7 0 4-3 7-7 7z" />
    </svg>
  ),
  wifi: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  ),
  parking: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M9 17V7h4a3 3 0 010 6H9" />
    </svg>
  ),
  pool: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 15c1.8 0 1.8-1.5 3.6-1.5S7.4 15 9.2 15s1.8-1.5 3.6-1.5S14.6 15 16.4 15s1.8-1.5 3.6-1.5M2 19.5c1.8 0 1.8-1.5 3.6-1.5S7.4 19.5 9.2 19.5s1.8-1.5 3.6-1.5S14.6 19.5 16.4 19.5s1.8-1.5 3.6-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V5.5a2 2 0 012-2M16 11V5.5a2 2 0 00-2-2M8 7.5h8" />
    </svg>
  ),
  local: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};

const SERVICE_KEYS = ["breakfast", "garden", "wifi", "parking", "pool", "local"] as const;

export function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.services.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto" />
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {SERVICE_KEYS.map((key) => (
            <div key={key} className="text-center">
              <div className="flex justify-center mb-4 text-stone/70">
                {SERVICE_ICONS[key]}
              </div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-charcoal mb-2 font-medium">
                {t.services[key].title}
              </h3>
              <p className="text-xs text-charcoal/55 leading-relaxed font-serif italic">
                {t.services[key].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
