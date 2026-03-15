"use client";

import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

const GALLERY_IMAGES = [
  { src: "/images/gallery/1.jpg", alt: "Il Casino Casalino" },
  { src: "/images/gallery/2.jpg", alt: "Camera Mirtillo" },
  { src: "/images/gallery/3.jpg", alt: "Camera Limone" },
  { src: "/images/gallery/4.jpg", alt: "Giardino" },
  { src: "/images/gallery/5.jpg", alt: "Colazione" },
  { src: "/images/gallery/6.jpg", alt: "Camera Oria" },
];

export function GallerySection() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const total = GALLERY_IMAGES.length;

  // Touch / pointer tracking for swipe
  const dragStartX = useRef<number | null>(null);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);

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
    <section id="gallery" className="bg-cream py-16 md:py-24 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-10 px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
          {t.gallery.heading}
        </h2>
        <div className="w-8 h-px bg-stone-light mx-auto" />
      </div>

      {/* Carousel — prev/next peek at the sides */}
      <div
        className="relative select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* Track */}
        <div
          className="flex items-center"
          style={{
            // Each slide is 78vw on mobile, 60vw on desktop (set via CSS var below)
          }}
        >
          {/* Slides */}
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-[1400px] flex items-center justify-center">
              {GALLERY_IMAGES.map((img, i) => {
                const offset = i - current;
                // Normalise for wrap-around
                const wrappedOffset =
                  offset > total / 2 ? offset - total :
                  offset < -total / 2 ? offset + total : offset;

                const isActive = wrappedOffset === 0;
                const isPrev = wrappedOffset === -1;
                const isNext = wrappedOffset === 1;
                const visible = Math.abs(wrappedOffset) <= 1;

                if (!visible) return null;

                return (
                  <div
                    key={img.src}
                    className="absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      width: isActive ? "clamp(280px, 60vw, 820px)" : "clamp(100px, 18vw, 240px)",
                      aspectRatio: "4/3",
                      zIndex: isActive ? 10 : 5,
                      opacity: isActive ? 1 : 0.45,
                      transform: isActive
                        ? "translateX(0) scale(1)"
                        : isPrev
                        ? "translateX(calc(-50vw * 0.52)) scale(0.92)"
                        : "translateX(calc(50vw * 0.52)) scale(0.92)",
                      cursor: isActive ? "default" : "pointer",
                    }}
                    onClick={() => {
                      if (isPrev) prev();
                      if (isNext) next();
                    }}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center bg-stone/10"
                      style={{ backgroundImage: `url('${img.src}')` }}
                      role="img"
                      aria-label={img.alt}
                    />
                    {/* Placeholder label */}
                    <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
                      {isActive && (
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 bg-charcoal/30 px-3 py-1 backdrop-blur-sm">
                          {img.alt}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Spacer to give the carousel block height */}
        <div
          className="pointer-events-none"
          style={{ paddingBottom: "min(45vw, 620px)", maxWidth: "1400px", margin: "0 auto" }}
        />

        {/* Prev / Next arrow buttons */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center text-charcoal/40 hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center text-charcoal/40 hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to image ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-4 h-1.5 bg-stone"
                : "w-1.5 h-1.5 bg-stone-light hover:bg-stone"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
