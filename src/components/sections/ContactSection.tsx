"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="bg-cream py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading title={t.contact.heading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-stone mb-1">
                {t.contact.address}
              </p>
              <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-stone mb-1">
                {t.contact.phone}
              </p>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}
                className="text-sm text-charcoal/80 hover:text-charcoal transition-colors"
              >
                {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-stone mb-1">
                {t.contact.email}
              </p>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                className="text-sm text-charcoal/80 hover:text-charcoal transition-colors"
              >
                {process.env.NEXT_PUBLIC_BUSINESS_EMAIL}
              </a>
            </div>
          </div>

          {/* Contact form */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire up to API or email service
            }}
          >
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
                {t.contact.form.name}
              </label>
              <input
                type="text"
                required
                className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal placeholder-stone/40 focus:outline-none focus:border-stone transition-colors"
                placeholder={t.contact.form.name}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
                {t.contact.form.email}
              </label>
              <input
                type="email"
                required
                className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal placeholder-stone/40 focus:outline-none focus:border-stone transition-colors"
                placeholder={t.contact.form.email}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
                {t.contact.form.message}
              </label>
              <textarea
                required
                rows={5}
                className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal placeholder-stone/40 focus:outline-none focus:border-stone transition-colors resize-none"
                placeholder={t.contact.form.message}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-charcoal text-white text-xs tracking-[0.2em] uppercase py-3 hover:bg-charcoal/80 transition-colors"
            >
              {t.contact.form.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
