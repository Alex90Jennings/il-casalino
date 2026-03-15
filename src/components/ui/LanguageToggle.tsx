"use client";

import { useLanguage } from "@/context/LanguageContext";

// Container:  h-7 (28px) × w-[64px]
// Knob:       h-[22px] × w-[22px]
// IT knob:    left-[2px]  top-[3px]                    (1px tighter to left than before)
// EN knob:    left-[2px] + translate-x-[37px]           (ends at right-[3px] = 64-3-22=39px)
// IT track flag: left-[2px]  (same box as IT knob)
// UK track flag: right-[5px] (pulled 2px inward from right edge — balances visual weight left)

export function LanguageToggle() {
  const { locale, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      aria-label={locale === "it" ? "Switch to English" : "Passa all'italiano"}
      className="relative h-7 w-[64px] rounded-full bg-white/10 border border-white/20 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      {/* Sliding knob — carries the active flag */}
      <span
        className={`absolute top-[2px] left-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center text-[13px] select-none ${locale === "en" ? "translate-x-[35.8px]" : "translate-x-0"
          }`}
      >
        {locale === "it" ? "🇮🇹" : "🇬🇧"}
      </span>

      {/* IT flag — track; opacity-0 when IT active (knob covers it) */}
      <span
        className={`absolute top-[3px] left-[2px] h-[22px] w-[22px] flex items-center justify-center text-[13px] select-none transition-opacity duration-200 ${locale === "it" ? "opacity-0" : "opacity-60"
          }`}
      >
        🇮🇹
      </span>

      {/* UK flag — track; pulled inward so visual weight sits left of pill center */}
      <span
        className={`absolute top-[3px] right-[5px] h-[22px] w-[22px] flex items-center justify-center text-[13px] select-none transition-opacity duration-200 ${locale === "en" ? "opacity-0" : "opacity-60"
          }`}
      >
        🇬🇧
      </span>
    </button>
  );
}
