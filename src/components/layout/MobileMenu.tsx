"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

const NAV_SECTIONS = [
  "home",
  "about",
  "rooms",
  "services",
  "gallery",
  "booking",
  "contact",
] as const;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNav = (sectionId: string) => {
    onClose();
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-nav flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-2 px-8 flex-1">
          {NAV_SECTIONS.map((key) => (
            <button
              key={key}
              onClick={() => handleNav(key === "home" ? "hero" : key)}
              className="text-left text-sm tracking-[0.15em] uppercase text-white/80 hover:text-white py-3 border-b border-white/10 transition-colors"
            >
              {t.nav[key]}
            </button>
          ))}
        </nav>

        {/* Language toggle */}
        <div className="px-8 py-8">
          <LanguageToggle />
        </div>
      </div>
    </>
  );
}
