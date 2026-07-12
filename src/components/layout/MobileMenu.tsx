"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { scrollToSection } from "@/lib/scroll";

const NAV_SECTIONS = [
  { key: "home" as const, sectionId: "hero" },
  { key: "about" as const, sectionId: "about" },
  { key: "gallery" as const, sectionId: "gallery" },
  { key: "services" as const, sectionId: "services" },
  { key: "rooms" as const, sectionId: "rooms" },
  { key: "booking" as const, sectionId: "booking" },
  { key: "contact" as const, sectionId: "contact" },
] as const;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleNav = (sectionId: string) => {
    onClose();
    // Brief delay lets the menu close before scroll starts
    setTimeout(() => scrollToSection(sectionId), 120);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-nav flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-5">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-7 flex-1">
          {NAV_SECTIONS.map(({ key, sectionId }) => (
            <button
              key={key}
              onClick={() => handleNav(sectionId)}
              className="text-left text-[11px] tracking-[0.18em] uppercase text-white/70 hover:text-white py-3 border-b border-white/8 transition-colors"
            >
              {t.nav[key]}
            </button>
          ))}
        </nav>

        <div className="px-7 py-8">
          <LanguageToggle />
        </div>
      </div>
    </>
  );
}
