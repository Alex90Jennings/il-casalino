"use client";

import { useLanguage } from "@/context/LanguageContext";
import { MediaCarousel } from "@/components/ui/MediaCarousel";
import { SHARED_GALLERY } from "@/data/media";

// First gallery reel — a large peek carousel of the shared-area videos and photos.
export function GallerySection() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="bg-cream pt-12 pb-8 md:pt-16 md:pb-10 overflow-hidden">
      <div className="text-center mb-8 px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
          {t.gallery.heading}
        </h2>
        <div className="w-8 h-px bg-stone-light mx-auto" />
      </div>
      <MediaCarousel items={SHARED_GALLERY} />
    </section>
  );
}
