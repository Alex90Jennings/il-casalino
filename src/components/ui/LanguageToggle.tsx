"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { locale, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className="relative flex items-center h-6 w-14 rounded-full bg-white/10 border border-white/20 px-0.5 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      {/* Track labels */}
      <span className="absolute left-1.5 text-[10px] font-medium tracking-wider text-white/70 select-none">
        IT
      </span>
      <span className="absolute right-1.5 text-[10px] font-medium tracking-wider text-white/70 select-none">
        EN
      </span>
      {/* Pill */}
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          locale === "en" ? "translate-x-8" : "translate-x-0"
        }`}
      />
    </button>
  );
}
