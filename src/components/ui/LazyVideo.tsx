"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";

interface LazyVideoProps {
  src: string;
  poster: string;
  alt: string;
  /** Localised accessible label for the reduced-motion play button. */
  playLabel: string;
  /** Only the active carousel slide plays; others stay a poster. */
  active: boolean;
  /** The gallery is scrolled into view — gates autoplay so room videos don't load on initial page load. */
  inView: boolean;
  /** Lead video: autoplay from page load (ignores inView) so it's already playing when reached. */
  eager?: boolean;
  sizes?: string;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false, // server snapshot — never autoplay-suppress during SSR
  );
}

// The active slide autoplays its room video muted and looped, with the native
// player chrome omitted — so sound can never be enabled. The <video> only mounts
// while the slide is active, so the MP4 is fetched on focus, never on initial
// page load, and no more than one video ever plays at once. Reduced-motion users
// are not autoplayed: they get a poster with a click-to-play button (still muted).
export function LazyVideo({ src, poster, alt, playLabel, active, inView, eager, sizes }: LazyVideoProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [clicked, setClicked] = useState(false);

  // Autoplay when this slide is active. Room videos also require the gallery to be
  // on screen (so they don't load on initial page load); the eager lead video
  // starts from page load so it's already playing by the time it's scrolled to.
  const play = active && (eager || inView) && (!reducedMotion || clicked);

  if (play) {
    return (
      <video
        src={src}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        className="w-full h-full object-cover bg-black"
      />
    );
  }

  const glyph = (
    <span className="w-14 h-14 rounded-full bg-charcoal/40 backdrop-blur-sm flex items-center justify-center transition-colors">
      <svg className="w-6 h-6 text-white translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        className="object-cover object-center select-none"
        draggable={false}
        sizes={sizes}
      />
      {active && reducedMotion ? (
        // Reduced motion: explicit, keyboard-operable play button (still muted).
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setClicked(true);
          }}
          aria-label={playLabel}
          className="absolute inset-0 flex items-center justify-center [&>span]:hover:bg-charcoal/60"
        >
          {glyph}
        </button>
      ) : (
        // Non-active slide: badge hint so the poster reads as a video.
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          {glyph}
        </div>
      )}
    </>
  );
}
