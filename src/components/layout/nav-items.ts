"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { scrollToSection } from "@/lib/scroll";

// Home-page sections scroll in place.
export const NAV_ITEMS = [
  { key: "home" as const, sectionId: "hero" },
  { key: "about" as const, sectionId: "about" },
  { key: "gallery" as const, sectionId: "gallery" },
  { key: "services" as const, sectionId: "services" },
  { key: "rooms" as const, sectionId: "rooms" },
  { key: "booking" as const, sectionId: "booking" },
  { key: "history" as const, sectionId: "history" },
  { key: "events" as const, sectionId: "events" },
  { key: "contact" as const, sectionId: "contact" },
];
export type NavItem = (typeof NAV_ITEMS)[number];

// Off the home page a section link navigates back to /{locale}#section; the
// sections' scroll-margin keeps the target clear of the fixed nav bar.
export function useNavigate() {
  const router = useRouter();
  const { locale } = useLanguage();
  return useCallback(
    (item: NavItem) => {
      if (document.getElementById(item.sectionId)) scrollToSection(item.sectionId);
      else router.push(`/${locale}#${item.sectionId}`);
    },
    [router, locale],
  );
}
