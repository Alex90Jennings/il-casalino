"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { LazyVideo } from "@/components/ui/LazyVideo";
import type { SharedItem } from "@/data/media";

// Slide takes 76% of container width; ~12% peeks each side.
const SLIDE_RATIO = 0.76;
const GAP = 16; // px between slides

function normalizeOffset(i: number, current: number, total: number): number {
  let offset = i - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

interface MediaCarouselProps {
  items: SharedItem[];
  /** Optional controls rendered above the carousel (e.g. the room selector).
      Receives the active slide index and a goTo(index) navigator. */
  renderAbove?: (api: { activeIndex: number; goTo: (i: number) => void }) => React.ReactNode;
}

// Large peek carousel of images and muted-autoplay videos. Only the active slide
// plays; playback is gated on the carousel being in view so nothing loads on the
// initial page render. Touch (swipe), arrow buttons and dots are all keyboard-
// and pointer-accessible. Used by both the shared reel and the rooms reel.
export function MediaCarousel({ items, renderAbove }: MediaCarouselProps) {
  const { t, locale } = useLanguage();
  const total = items.length;
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const slideW = containerW * SLIDE_RATIO;
  const centerX = (containerW - slideW) / 2;

  // Animated jump: step one slide at a time toward a target so selecting a
  // distant room reads as a quick scroll to its clips rather than an abrupt cut.
  const [animTarget, setAnimTarget] = useState<number | null>(null);
  useEffect(() => {
    if (animTarget === null || current === animTarget) return;
    const id = setTimeout(() => setCurrent((c) => c + Math.sign(animTarget - c)), 55);
    return () => clearTimeout(id);
  }, [animTarget, current]);

  // While stepping toward a target, no slide counts as "active" for playback —
  // so clips aren't fetched mid-scroll; only the destination clip plays.
  const animating = animTarget !== null && current !== animTarget;

  const goTo = useCallback((target: number) => setAnimTarget(target), []);
  const jumpTo = useCallback((i: number) => {
    setAnimTarget(null);
    setCurrent(i);
  }, []);
  const prev = useCallback(() => {
    setAnimTarget(null);
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);
  const next = useCallback(() => {
    setAnimTarget(null);
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
    dragStartX.current = null;
  };

  return (
    <>
      {renderAbove?.({ activeIndex: current, goTo })}
      <div className="max-w-5xl mx-auto">
        <div
          ref={containerRef}
          className="relative"
          style={{ paddingBottom: "57%" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {containerW > 0 &&
            items.map((slide, i) => {
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
                        active={isActive && !animating}
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

      <div className="flex justify-center items-center gap-1.5 mt-5">
        {items.map((slide, i) => {
          const dist = Math.abs(i - current);
          const isActive = i === current;
          const isNear = dist <= 1;
          return (
            <button
              key={slide.id}
              onClick={() => jumpTo(i)}
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
    </>
  );
}
