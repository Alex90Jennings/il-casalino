"use client";

import { Fragment, type ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

const LINK = "underline underline-offset-4 decoration-stone-light hover:text-charcoal transition-colors";

// Renders a notice string, turning its {{tokens}} into links. Kept here rather
// than as markup in the translations so the copy stays plain, reviewable text.
function rich(text: string, links: Record<string, ReactNode>): ReactNode {
  return text.split(/(\{\{\w+\}\})/).map((part, i) => {
    const token = part.match(/^\{\{(\w+)\}\}$/)?.[1];
    return <Fragment key={i}>{token && token in links ? links[token] : part}</Fragment>;
  });
}

export function PrivacyContent() {
  const { t } = useLanguage();
  const p = t.privacy;
  const links: Record<string, ReactNode> = {
    email: <a href="mailto:ilcasinocasalino@gmail.com" className={LINK}>ilcasinocasalino@gmail.com</a>,
    phone: <a href="tel:+393277755170" className={LINK}>+39 327 775 5170</a>,
    holidu: <a href={p.holiduPolicyUrl} target="_blank" rel="noopener noreferrer" className={LINK}>{p.holiduPolicyUrl.replace(/^https:\/\/(www\.)?/, "")}</a>,
    garante: <a href={p.garanteUrl} target="_blank" rel="noopener noreferrer" className={LINK}>garanteprivacy.it</a>,
  };

  return (
    <article className="max-w-3xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      <header className="text-center mb-14">
        <h1 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">{p.title}</h1>
        <div className="w-8 h-px bg-stone-light mx-auto mb-5" />
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone">{p.updated}</p>
      </header>

      <div className="space-y-4 text-sm font-light leading-relaxed text-charcoal/80">
        {p.intro.map((para) => <p key={para}>{rich(para, links)}</p>)}
      </div>

      {p.sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="mt-12 scroll-mt-24">
          <h2 id={`${section.id}-heading`} className="font-serif text-lg md:text-xl font-light tracking-[0.08em] uppercase text-charcoal mb-4">
            {section.heading}
          </h2>
          <div className="space-y-4 text-sm font-light leading-relaxed text-charcoal/80">
            {section.paragraphs.map((para) => <p key={para}>{rich(para, links)}</p>)}
            {section.items && (
              <ul className="list-disc pl-5 space-y-2 marker:text-stone-light">
                {section.items.map((item) => <li key={item}>{rich(item, links)}</li>)}
              </ul>
            )}
            {section.after?.map((para) => <p key={para}>{rich(para, links)}</p>)}
          </div>

          {section.id === "cookie" && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs font-light text-charcoal/80 border-collapse">
                <caption className="sr-only">{p.cookieTable.caption}</caption>
                <thead>
                  <tr className="border-b border-stone-light">
                    {Object.values(p.cookieTable.headers).map((h) => (
                      <th key={h} scope="col" className="py-2 pr-4 text-[10px] tracking-[0.15em] uppercase font-normal text-stone">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.cookieTable.rows.map((row) => (
                    <tr key={row.name} className="border-b border-stone-light/50 align-top">
                      <th scope="row" className="py-3 pr-4 font-normal text-charcoal">{row.name}</th>
                      <td className="py-3 pr-4">{row.provider}</td>
                      <td className="py-3 pr-4">{row.purpose}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{row.duration}</td>
                      <td className="py-3">{row.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </article>
  );
}
