"use client";

// Holidu booking module. The widget posts `{ type: "resize", height }` messages
// so the host page can grow the iframe to fit its content — this dynamic height
// is one reason this component is client-side; the other is that it follows the
// site's live language toggle.

import { useEffect, useState } from "react";
import { buildHoliduWidgetUrl, HOLIDU_WIDGET_ORIGIN, type SiteLocale } from "@/lib/holidu";

// Vertical floor so the module never collapses into an unusable frame before —
// or if — a resize message arrives (covers desktop, tablet and mobile).
const MIN_HEIGHT = 640;

interface HoliduWidgetProps {
  locale: SiteLocale;
  title: string;
  fallbackLabel: string;
}

export function HoliduWidget({ locale, title, fallbackLabel }: HoliduWidgetProps) {
  const [height, setHeight] = useState(MIN_HEIGHT);
  // src is derived from the selected locale; key={locale} forces the iframe to
  // reload (in the new language) when the site language changes.
  const src = buildHoliduWidgetUrl(locale);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== HOLIDU_WIDGET_ORIGIN) return;
      const data = event.data;
      if (data?.type === "resize" && typeof data.height === "number") {
        setHeight(Math.max(data.height, MIN_HEIGHT));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full max-w-[1280px] mx-auto">
        <iframe
          key={locale}
          id="host-websites-booking-module"
          src={src}
          title={title}
          loading="lazy"
          className="block w-full min-h-[640px] border-0 bg-white"
          style={{ height }}
        />
      </div>
      <p className="mt-5 text-center text-xs font-light tracking-[0.08em] text-stone">
        <a
          href={buildHoliduWidgetUrl(locale, { standalone: true })}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-stone-light/70 hover:text-charcoal transition-colors"
        >
          {fallbackLabel}
        </a>
      </p>
    </div>
  );
}
