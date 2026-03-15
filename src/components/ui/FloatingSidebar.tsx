"use client";

// Fixed right-side floating contact/social bar.
// Visible only on md+ screens to avoid mobile layout interference.

const LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/ilcasinocasalino/", // update if handle differs
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "ilcasinocasalino@gmail.com"}`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
      </svg>
    ),
  },
  {
    id: "maps",
    label: "Google Maps",
    href: "https://maps.google.com/?q=Il+Casino+Casalino+Francavilla+Fontana+Brindisi",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
] as const;

export function FloatingSidebar() {
  return (
    <aside
      className="fixed right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col"
      aria-label="Social & contact links"
    >
      {LINKS.map((link, i) => (
        <a
          key={link.id}
          href={link.href}
          target={link.id !== "email" ? "_blank" : undefined}
          rel={link.id !== "email" ? "noopener noreferrer" : undefined}
          aria-label={link.label}
          title={link.label}
          className={`
            w-9 h-9 flex items-center justify-center
            text-stone/50 hover:text-charcoal
            bg-cream/80 hover:bg-cream
            border-l border-stone-light/30
            backdrop-blur-sm
            transition-colors duration-200
            ${i === 0 ? "border-t rounded-tl-sm" : ""}
            ${i === LINKS.length - 1 ? "border-b rounded-bl-sm" : ""}
          `}
        >
          {link.icon}
        </a>
      ))}
    </aside>
  );
}
