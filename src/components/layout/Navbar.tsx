"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { MobileMenu } from "./MobileMenu";

const NAV_SECTIONS = [
  { key: "home" as const, sectionId: "hero" },
  { key: "about" as const, sectionId: "about" },
  { key: "rooms" as const, sectionId: "rooms" },
  { key: "services" as const, sectionId: "services" },
  { key: "gallery" as const, sectionId: "gallery" },
  { key: "booking" as const, sectionId: "booking" },
  { key: "contact" as const, sectionId: "contact" },
];

export function Navbar() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-shadow duration-300 bg-nav ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Desktop nav — left */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_SECTIONS.slice(0, 3).map(({ key, sectionId }) => (
              <button
                key={key}
                onClick={() => scrollTo(sectionId)}
                className="text-[11px] tracking-[0.18em] uppercase text-white/75 hover:text-white transition-colors"
              >
                {t.nav[key]}
              </button>
            ))}
          </nav>

          {/* Logo — center */}
          <button
            onClick={() => scrollTo("hero")}
            className="absolute left-1/2 -translate-x-1/2 text-[11px] tracking-[0.18em] uppercase text-white/90 hover:text-white transition-colors font-medium"
          >
            {process.env.NEXT_PUBLIC_SITE_NAME ?? "Il Casino Casalino"}
          </button>

          {/* Desktop nav — right */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_SECTIONS.slice(3).map(({ key, sectionId }) => (
              <button
                key={key}
                onClick={() => scrollTo(sectionId)}
                className="text-[11px] tracking-[0.18em] uppercase text-white/75 hover:text-white transition-colors"
              >
                {t.nav[key]}
              </button>
            ))}
            <LanguageToggle />
          </nav>

          {/* Mobile — hamburger */}
          <button
            className="md:hidden ml-auto text-white/80 hover:text-white transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
