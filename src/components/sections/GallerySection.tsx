"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { GALLERY, ROOMS, ROOM_ORDER, firstGalleryIndex, type RoomKey, type RoomIcon } from "@/data/media";

// Slide takes 76% of container width; ~12% peeks each side.
const SLIDE_RATIO = 0.76;
const GAP = 16; // px between slides

function normalizeOffset(i: number, current: number, total: number): number {
  let offset = i - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

const ROOM_ICONS: Record<RoomIcon, React.ReactNode> = {
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <circle cx="12" cy="12" r="3.5" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 16.9l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76z" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13.5A7.5 7.5 0 1 1 10.5 4a6 6 0 0 0 9.5 9.5z" />
    </svg>
  ),
  shell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.15}>
      {/* Scallop: scalloped top edge, rounded sides, hinge tab; nudged up to sit centred */}
      <g transform="translate(0,-1)">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6.8q1.8-2 3.6 0 1.8-2 3.6 0 1.8-2 3.6 0 1.8-2 3.6 0 1.8-2 3.6 0C21 13 16.2 19 13 20.2L12.9 21.6Q12 22 11.1 21.6L11 20.2C7.8 19 3 13 3 6.8Z"
        />
        {/* Radiating ribs */}
        <path
          strokeLinecap="round"
          d="M12 20 4.9 6.6M12 20 8.4 5.6M12 20 12 5.2M12 20 15.6 5.6M12 20 19.1 6.6"
        />
      </g>
    </svg>
  ),
};

// The full, continuous gallery is the single source of truth (see src/data/media).
const slides = GALLERY;
const total = slides.length;

export function GallerySection() {
  const { t, locale } = useLanguage();
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [inView, setInView] = useState(false);
  const iconRefs = useRef(new Map<RoomKey, HTMLButtonElement>());

  // The room the active slide belongs to ("shared" → no room selected).
  const activeGroup = slides[current]?.group ?? "shared";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Gate video autoplay on the gallery being on screen — keeps the lead video
  // (and every room video) off the initial page load.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the active room icon visible when the selector overflows horizontally
  // on mobile. Scrolls only the selector (block: nearest → never the page) and
  // never moves focus, so ordinary swipe/arrow navigation stays undisturbed.
  useEffect(() => {
    const key = ROOM_ORDER.find((k) => ROOMS[k].group === activeGroup);
    if (!key) return;
    iconRefs.current.get(key)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeGroup]);

  const slideW = containerW * SLIDE_RATIO;
  const centerX = (containerW - slideW) / 2;

  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), []);
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), []);

  // Room selector = navigation: jump to that room's first slide without filtering.
  const goToRoom = (key: RoomKey) => {
    const idx = firstGalleryIndex(ROOMS[key].group);
    if (idx >= 0) setCurrent(idx);
  };

  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStartX.current = null;
  };

  return (
    <section id="gallery" className="bg-cream pt-12 pb-8 md:pt-16 md:pb-10 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-6 px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
          {t.gallery.heading}
        </h2>
        <div className="w-8 h-px bg-stone-light mx-auto" />
      </div>

      {/* Room selector — navigation, not a filter. Jumps to each room's first slide. */}
      <div className="overflow-x-auto mb-9">
        <div
          role="group"
          aria-label={t.gallery.chooseRoom}
          className="flex w-max mx-auto gap-4 sm:gap-8 px-6 pb-1"
        >
          {ROOM_ORDER.map((key) => {
            const room = ROOMS[key];
            const selected = activeGroup === room.group;
            return (
              <button
                key={key}
                type="button"
                ref={(el) => {
                  if (el) iconRefs.current.set(key, el);
                }}
                onClick={() => goToRoom(key)}
                aria-pressed={selected}
                aria-label={`${room.name[locale]} — ${t.gallery.roomMedia}`}
                className="group flex flex-col items-center gap-2 focus:outline-none"
              >
                <span
                  className={`w-12 h-12 flex items-center justify-center rounded-full border transition-colors duration-300 ${
                    selected
                      ? "border-charcoal text-charcoal bg-charcoal/[0.04]"
                      : "border-stone-light/70 text-stone/70 group-hover:border-stone group-hover:text-stone group-focus-visible:border-stone"
                  }`}
                >
                  <span className="w-6 h-6">{ROOM_ICONS[room.icon]}</span>
                </span>
                <span
                  className={`text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                    selected ? "text-charcoal" : "text-stone/70 group-hover:text-stone"
                  }`}
                >
                  {room.name[locale]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carousel — always the full, continuous gallery */}
      <div className="max-w-5xl mx-auto">
        <div
          ref={containerRef}
          className="relative"
          style={{ paddingBottom: "57%" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {containerW > 0 &&
            slides.map((slide, i) => {
              const offset = normalizeOffset(i, current, total);
              if (Math.abs(offset) > 2) return null;

              const translateX = centerX + offset * (slideW + GAP);
              const isActive = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;

              return (
                <div
                  key={slide.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    height: "100%",
                    width: `${slideW}px`,
                    transform: `translateX(${translateX}px)`,
                    transition:
                      "transform 550ms cubic-bezier(0.4,0,0.2,1), opacity 400ms ease, filter 400ms ease",
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
                    {slide.kind === "image" ? (
                      <Image
                        src={slide.src}
                        alt={slide.alt[locale]}
                        fill
                        className="object-cover object-center select-none"
                        draggable={false}
                        sizes="(max-width: 768px) 85vw, 70vw"
                      />
                    ) : (
                      <LazyVideo
                        src={slide.src}
                        poster={slide.poster}
                        alt={slide.alt[locale]}
                        playLabel={`${t.gallery.playVideo} — ${slide.caption[locale]}`}
                        active={isActive}
                        inView={inView}
                        sizes="(max-width: 768px) 85vw, 70vw"
                      />
                    )}

                    {isActive && slide.kind === "image" && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)",
                        }}
                      />
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 pointer-events-none">
                        <span className="text-[9px] tracking-[0.22em] uppercase text-white/75 bg-charcoal/20 px-3 py-1 backdrop-blur-sm">
                          {slide.caption[locale]}
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
            aria-label={t.gallery.previous}
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-white bg-charcoal/50 hover:bg-charcoal/75 backdrop-blur-sm shadow-md ring-1 ring-white/20 transition-all rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label={t.gallery.next}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-white bg-charcoal/50 hover:bg-charcoal/75 backdrop-blur-sm shadow-md ring-1 ring-white/20 transition-all rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-5">
        {slides.map((slide, i) => {
          const dist = Math.abs(i - current);
          const isActive = i === current;
          const isNear = dist <= 1;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrent(i)}
              aria-label={slide.caption[locale]}
              className="transition-all duration-300 rounded-full flex-shrink-0"
              style={{
                width: isActive ? "16px" : isNear ? "6px" : "4px",
                height: isActive ? "6px" : "4px",
                backgroundColor: isActive ? "var(--color-stone)" : "var(--color-stone-light)",
                opacity: dist > 4 ? 0.4 : 1,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
