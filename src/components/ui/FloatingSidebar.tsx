"use client";

// Right-side vertical rail (desktop, md+) + bottom-centre pill (mobile, < md).
// Both are in the DOM simultaneously; gradient IDs are suffixed -d / -m to avoid collisions.

// ---------------------------------------------------------------------------
// Desktop icons — w-7 h-7, gradient IDs ending in -d
// ---------------------------------------------------------------------------
const DESKTOP_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/ilcasinocasalino/",
    hoverClass: "",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig-grad-d" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#F77737" />
            <stop offset="55%"  stopColor="#E1306C" />
            <stop offset="100%" stopColor="#DD2A7B" />
          </linearGradient>
        </defs>
        <g className="transition-opacity duration-200 opacity-100 group-hover:opacity-0" stroke="currentColor" strokeWidth={1.3}>
          <rect x="2" y="2" width="20" height="20" rx="6" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
        </g>
        <g className="transition-opacity duration-200 opacity-0 group-hover:opacity-100" strokeWidth={1.3}>
          <rect x="2" y="2" width="20" height="20" rx="6" strokeLinejoin="round" stroke="url(#ig-grad-d)" />
          <circle cx="12" cy="12" r="3.5" stroke="url(#ig-grad-d)" />
          <circle cx="17.4" cy="6.6" r="0.8" fill="url(#ig-grad-d)" stroke="none" />
        </g>
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "ilcasinocasalino@gmail.com"}`,
    hoverClass: "hover:text-[#1A73E8]",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <rect x="2.5" y="5.5" width="19" height="13" rx="2" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 5.5L12 14l9.5-8.5" />
      </svg>
    ),
  },
  {
    id: "maps",
    label: "Google Maps",
    href: "https://maps.google.com/?q=Il+Casino+Casalino+Francavilla+Fontana+Brindisi",
    hoverClass: "",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="maps-grad-d" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#34A853" />
            <stop offset="100%" stopColor="#4285F4" />
          </linearGradient>
        </defs>
        <g className="transition-opacity duration-200 opacity-100 group-hover:opacity-0">
          <path stroke="currentColor" strokeLinejoin="round" strokeWidth={1.2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          <circle cx="12" cy="9.8" r="2.8" stroke="currentColor" strokeWidth={1.4} />
        </g>
        <g className="transition-opacity duration-200 opacity-0 group-hover:opacity-100">
          <path stroke="url(#maps-grad-d)" strokeLinejoin="round" strokeWidth={1.2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          <circle cx="12" cy="9.8" r="2.8" stroke="url(#maps-grad-d)" strokeWidth={1.4} />
        </g>
      </svg>
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Mobile icons — w-5 h-5, gradient IDs ending in -m
// ---------------------------------------------------------------------------
const MOBILE_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/ilcasinocasalino/",
    hoverClass: "",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig-grad-m" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#F77737" />
            <stop offset="55%"  stopColor="#E1306C" />
            <stop offset="100%" stopColor="#DD2A7B" />
          </linearGradient>
        </defs>
        <g className="transition-opacity duration-200 opacity-100 group-hover:opacity-0" stroke="currentColor" strokeWidth={1.3}>
          <rect x="2" y="2" width="20" height="20" rx="6" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
        </g>
        <g className="transition-opacity duration-200 opacity-0 group-hover:opacity-100" strokeWidth={1.3}>
          <rect x="2" y="2" width="20" height="20" rx="6" strokeLinejoin="round" stroke="url(#ig-grad-m)" />
          <circle cx="12" cy="12" r="3.5" stroke="url(#ig-grad-m)" />
          <circle cx="17.4" cy="6.6" r="0.8" fill="url(#ig-grad-m)" stroke="none" />
        </g>
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "ilcasinocasalino@gmail.com"}`,
    hoverClass: "hover:text-[#1A73E8]",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <rect x="2.5" y="5.5" width="19" height="13" rx="2" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 5.5L12 14l9.5-8.5" />
      </svg>
    ),
  },
  {
    id: "maps",
    label: "Google Maps",
    href: "https://maps.google.com/?q=Il+Casino+Casalino+Francavilla+Fontana+Brindisi",
    hoverClass: "",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="maps-grad-m" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#34A853" />
            <stop offset="100%" stopColor="#4285F4" />
          </linearGradient>
        </defs>
        <g className="transition-opacity duration-200 opacity-100 group-hover:opacity-0">
          <path stroke="currentColor" strokeLinejoin="round" strokeWidth={1.2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          <circle cx="12" cy="9.8" r="2.8" stroke="currentColor" strokeWidth={1.4} />
        </g>
        <g className="transition-opacity duration-200 opacity-0 group-hover:opacity-100">
          <path stroke="url(#maps-grad-m)" strokeLinejoin="round" strokeWidth={1.2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          <circle cx="12" cy="9.8" r="2.8" stroke="url(#maps-grad-m)" strokeWidth={1.4} />
        </g>
      </svg>
    ),
  },
] as const;

// ---------------------------------------------------------------------------

export function FloatingSidebar() {
  return (
    <>
      {/* ── Desktop: vertical right rail, md and above ── */}
      <aside
        className="fixed right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col"
        aria-label="Social & contact links"
      >
        {DESKTOP_LINKS.map((link, i) => (
          <a
            key={link.id}
            href={link.href}
            target={link.id !== "email" ? "_blank" : undefined}
            rel={link.id !== "email" ? "noopener noreferrer" : undefined}
            aria-label={link.label}
            title={link.label}
            className={`
              group
              w-16 h-16 flex items-center justify-center
              text-stone/50 ${link.hoverClass}
              bg-cream/80
              border-l border-stone-light/30
              backdrop-blur-sm
              transition-colors duration-200
              ${i === 0 ? "border-t rounded-tl-md" : ""}
              ${i === DESKTOP_LINKS.length - 1 ? "border-b rounded-bl-md" : ""}
            `}
          >
            {link.icon}
          </a>
        ))}
      </aside>

      {/* ── Mobile: horizontal pill, centred at bottom, below md ── */}
      <aside
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex md:hidden flex-row rounded-full overflow-hidden bg-cream/85 backdrop-blur-sm border border-stone-light/30 shadow-sm"
        aria-label="Social & contact links"
      >
        {MOBILE_LINKS.map((link, i) => (
          <a
            key={link.id}
            href={link.href}
            target={link.id !== "email" ? "_blank" : undefined}
            rel={link.id !== "email" ? "noopener noreferrer" : undefined}
            aria-label={link.label}
            title={link.label}
            className={`
              group
              w-12 h-12 flex items-center justify-center
              text-stone/50 ${link.hoverClass}
              transition-colors duration-200
              ${i < MOBILE_LINKS.length - 1 ? "border-r border-stone-light/20" : ""}
            `}
          >
            {link.icon}
          </a>
        ))}
      </aside>
    </>
  );
}
