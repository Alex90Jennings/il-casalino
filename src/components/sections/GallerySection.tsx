"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { Room } from "@/types/room";

// ---------------------------------------------------------------------------
// Image manifest — property shots first, then per-room pairs
// ---------------------------------------------------------------------------
const SLIDES = [
  { src: "/images/fireplace.jpg",       labelIt: "Camino",          labelEn: "Fireplace",      pos: "object-center" },
  { src: "/images/gate-entrance.jpg",   labelIt: "Ingresso",        labelEn: "Entrance",       pos: "object-center" },
  { src: "/images/courtyard.jpg",       labelIt: "Cortile",         labelEn: "Courtyard",      pos: "object-center" },
  { src: "/images/pool.jpg",            labelIt: "Piscina",         labelEn: "Pool",           pos: "object-center" },
  { src: "/images/outdoor-eating.jpg",  labelIt: "Pranzo in giardino", labelEn: "Garden dining", pos: "object-center" },
  { src: "/images/dinner-table.jpg",    labelIt: "Cena",            labelEn: "Dinner",         pos: "object-center" },
  { src: "/images/breakfast-table-1.jpg", labelIt: "Colazione",    labelEn: "Breakfast",      pos: "object-center" },
  { src: "/images/church.jpg",          labelIt: "Francavilla Fontana", labelEn: "Francavilla Fontana", pos: "object-center" },
  // Stella & Luna — indices 8–9 (shared bedroom/bathroom)
  { src: "/images/1-bedroom.jpg",       labelIt: "Stella · Luna",       labelEn: "Star · Moon",        pos: "object-center" },
  { src: "/images/1-bathroom.jpg",      labelIt: "Bagno · Stella · Luna", labelEn: "Star · Moon — Bath", pos: "object-center" },
  // Venere & Marte — indices 10–11 (shared bedroom/bathroom)
  { src: "/images/2-bedroom.jpg",       labelIt: "Venere · Marte",      labelEn: "Venus · Mars",       pos: "object-center" },
  { src: "/images/2-bathroom.jpg",      labelIt: "Bagno · Venere · Marte", labelEn: "Venus · Mars — Bath", pos: "object-center" },
];

const TOTAL = SLIDES.length; // 12

// First image index in the gallery for each room — used by booking link
const ROOM_SLIDE_INDEX: Record<Room, number> = {
  Stella: 8,
  Luna: 8,
  Venere: 10,
  Marte: 10,
};

// Slide takes 76% of container width; 12% peeks each side
const SLIDE_RATIO = 0.76;
const GAP = 16; // px between slides

function normalizeOffset(i: number, current: number, total: number): number {
  let offset = i - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

export function GallerySection() {
  const { t, locale } = useLanguage();
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  // Measure container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const slideW = containerW * SLIDE_RATIO;
  const centerX = (containerW - slideW) / 2;

  const prev = useCallback(() => setCurrent((i) => (i - 1 + TOTAL) % TOTAL), []);
  const next = useCallback(() => setCurrent((i) => (i + 1) % TOTAL), []);

  // Booking → gallery link: listen for room-focus events
  useEffect(() => {
    const handler = (e: Event) => {
      const room = (e as CustomEvent<{ room: Room }>).detail.room;
      const idx = ROOM_SLIDE_INDEX[room];
      if (idx !== undefined) setCurrent(idx);
    };
    window.addEventListener("casalino:room-focus", handler);
    return () => window.removeEventListener("casalino:room-focus", handler);
  }, []);

  // Pointer / swipe
  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { dragStartX.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStartX.current = null;
  };

  return (
    <section id="gallery" className="bg-cream pt-12 pb-8 md:pt-16 md:pb-10 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-8 px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
          {t.gallery.heading}
        </h2>
        <div className="w-8 h-px bg-stone-light mx-auto" />
      </div>

      {/* Carousel — constrained width so peek is proportional */}
      <div className="max-w-5xl mx-auto">
        {/*
          pb-[57%] = SLIDE_RATIO (0.76) × aspect-ratio height factor (0.75) × 100
          This gives the container intrinsic height without JS.
          Slides are absolutely positioned inside it.
          The section's overflow-hidden clips the horizontal peek.
        */}
        <div
          ref={containerRef}
          className="relative"
          style={{ paddingBottom: "57%" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {containerW > 0 &&
            SLIDES.map((slide, i) => {
              const offset = normalizeOffset(i, current, TOTAL);
              // Render current + one on each side + one more for pre-positioning during transition
              if (Math.abs(offset) > 2) return null;

              const translateX = centerX + offset * (slideW + GAP);
              const isActive = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: 0,
                    height: "100%",
                    width: `${slideW}px`,
                    transform: `translateX(${translateX}px)`,
                    transition: "transform 550ms cubic-bezier(0.4,0,0.2,1), opacity 400ms ease, filter 400ms ease",
                    opacity: isActive ? 1 : isAdjacent ? 0.55 : 0,
                    filter: isActive ? "brightness(1)" : "brightness(0.72)",
                    zIndex: isActive ? 2 : 1,
                    cursor: isAdjacent ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (offset < 0) prev();
                    if (offset > 0) next();
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={slide.src}
                      alt={locale === "it" ? slide.labelIt : slide.labelEn}
                      fill
                      className={`object-cover ${slide.pos} select-none`}
                      draggable={false}
                      sizes="(max-width: 768px) 85vw, 70vw"
                    />
                    {/* Subtle edge vignette on active slide */}
                    {isActive && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)",
                        }}
                      />
                    )}
                    {/* Caption on active slide */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 pointer-events-none">
                        <span className="text-[9px] tracking-[0.22em] uppercase text-white/75 bg-charcoal/20 px-3 py-1 backdrop-blur-sm">
                          {locale === "it" ? slide.labelIt : slide.labelEn}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Arrow buttons */}
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white bg-charcoal/25 hover:bg-charcoal/45 backdrop-blur-sm transition-all rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white bg-charcoal/25 hover:bg-charcoal/45 backdrop-blur-sm transition-all rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dot indicators — windowed to max 9 visible */}
      <div className="flex justify-center items-center gap-1.5 mt-5">
        {SLIDES.map((_, i) => {
          const dist = Math.abs(i - current);
          // Show all dots; scale down distant ones for a windowed feel
          const isActive = i === current;
          const isNear = dist <= 1;
          return (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Image ${i + 1}`}
              className="transition-all duration-300 rounded-full flex-shrink-0"
              style={{
                width: isActive ? "16px" : isNear ? "6px" : "4px",
                height: isActive ? "6px" : "4px",
                backgroundColor: isActive
                  ? "var(--color-stone)"
                  : "var(--color-stone-light)",
                opacity: dist > 4 ? 0.4 : 1,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
