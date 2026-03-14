"use client";

import { useLanguage } from "@/context/LanguageContext";

interface BreakfastToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function BreakfastToggle({ checked, onChange }: BreakfastToggleProps) {
  const { t } = useLanguage();
  const price = process.env.NEXT_PUBLIC_BREAKFAST_PRICE_PER_PERSON_PER_NIGHT ?? "6";

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <span
        className={`relative inline-flex h-5 w-9 rounded-full border transition-colors duration-200 ${
          checked ? "bg-charcoal border-charcoal" : "bg-white border-stone-light"
        }`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
      <span className="text-sm text-charcoal/80 font-light group-hover:text-charcoal transition-colors">
        {t.booking.breakfast.replace("{{price}}", price)}
      </span>
    </label>
  );
}
