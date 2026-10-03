"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS, useNavigate } from "./nav-items";

// Left group: home · about · gallery · services. Right: the rest + language toggle.
const NAV_SPLIT = 4;

export function Navbar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-shadow duration-300 bg-nav ${scrolled ? "shadow-sm" : ""
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Desktop nav — left */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_ITEMS.slice(0, NAV_SPLIT).map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item)}
                className="text-[11px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors"
              >
                {t.nav[item.key]}
              </button>
            ))}
          </nav>

          {/* Logo — center, mobile only; on desktop the nav items fill the bar */}
          <button
            onClick={() => navigate(NAV_ITEMS[0])}
            className="md:hidden absolute left-1/2 -translate-x-1/2 text-[11px] tracking-[0.2em] uppercase text-white/85 hover:text-white transition-colors font-medium"
          >
            Il Casino Casalino B&B
          </button>

          {/* Desktop nav — right */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_ITEMS.slice(NAV_SPLIT).map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item)}
                className="text-[11px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors"
              >
                {t.nav[item.key]}
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
