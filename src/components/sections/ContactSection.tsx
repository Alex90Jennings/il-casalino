"use client";

import { useLanguage } from "@/context/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="bg-cream py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.contact.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto" />
        </div>

        {/* Info strip — centered, like the reference */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-12 text-center">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1.5">
              {t.contact.email}
            </p>
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
              className="text-xs text-charcoal/75 hover:text-charcoal transition-colors"
            >
              {process.env.NEXT_PUBLIC_BUSINESS_EMAIL}
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1.5">
              {t.contact.address}
            </p>
            <p className="text-xs text-charcoal/75 leading-relaxed max-w-[200px] mx-auto">
              {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS}
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1.5">
              {t.contact.phone}
            </p>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}
              className="text-xs text-charcoal/75 hover:text-charcoal transition-colors"
            >
              {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
            </a>
          </div>
        </div>

        {/* Form */}
        <form
          className="max-w-2xl mx-auto space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: wire up to API or email service
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-stone mb-1.5">
                {t.contact.form.name}
              </label>
              <input
                type="text"
                required
                className="w-full border-b border-stone-light/70 bg-transparent px-0 py-2 text-sm text-charcoal placeholder-stone/35 focus:outline-none focus:border-stone transition-colors"
                placeholder={t.contact.form.name}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-stone mb-1.5">
                {t.contact.form.email}
              </label>
              <input
                type="email"
                required
                className="w-full border-b border-stone-light/70 bg-transparent px-0 py-2 text-sm text-charcoal placeholder-stone/35 focus:outline-none focus:border-stone transition-colors"
                placeholder={t.contact.form.email}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-stone mb-1.5">
              {t.contact.form.message}
            </label>
            <textarea
              required
              rows={4}
              className="w-full border-b border-stone-light/70 bg-transparent px-0 py-2 text-sm text-charcoal placeholder-stone/35 focus:outline-none focus:border-stone transition-colors resize-none"
              placeholder={t.contact.form.message}
            />
          </div>
          <div className="text-center pt-2">
            <button
              type="submit"
              className="px-10 py-2.5 bg-charcoal text-white text-[10px] tracking-[0.25em] uppercase hover:bg-charcoal/80 transition-colors"
            >
              {t.contact.form.send}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
