"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Placeholder gallery slots — replace with real images
const GALLERY_IMAGES = [
  { src: "/images/gallery/1.jpg", alt: "Il Casino Casalino", wide: true },
  { src: "/images/gallery/2.jpg", alt: "Camera Mirtillo" },
  { src: "/images/gallery/3.jpg", alt: "Camera Limone" },
  { src: "/images/gallery/4.jpg", alt: "Giardino", wide: true },
  { src: "/images/gallery/5.jpg", alt: "Colazione" },
  { src: "/images/gallery/6.jpg", alt: "Camera Oria" },
];

export function GallerySection() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title={t.gallery.heading} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMAGES.map(({ src, alt, wide }) => (
            <div
              key={src}
              className={`relative overflow-hidden bg-stone-light/20 aspect-square group ${
                wide ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Placeholder when no image */}
              <div className="absolute inset-0 flex items-center justify-center bg-stone/10">
                <span className="text-stone/30 text-xs tracking-widest uppercase">{alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
