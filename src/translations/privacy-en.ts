import type { PrivacyContent } from "./privacy-it";

export const privacyEn: PrivacyContent = {
  metaTitle: "Privacy and cookie policy",
  metaDescription:
    "How Il Casino Casalino handles the personal data of people who visit the site, write through the contact form, book or stay, and which cookies are used.",
  title: "Privacy and cookie policy",
  updated: "Last updated: 3 October 2026",
  intro: [
    "Under Articles 13 and 14 of Regulation (EU) 2016/679 (GDPR) and the Italian Personal Data Protection Code (Legislative Decree 196/2003), this notice explains how we handle the personal data of people who visit this site, write to us, book or stay at Il Casino Casalino. The Italian version is the reference text.",
  ],
  sections: [
    {
      id: "titolare",
      heading: "Data controller",
      paragraphs: [
        "The data controller is Simona di Punzio, who runs the guest accommodation Il Casino Casalino, Contrada Casalino 18, 72021 Francavilla Fontana (BR), Italy. VAT number 08684360723, CIN IT074008B400126364.",
        "For any question or request about your data, write to {{email}} or call {{phone}}. No data protection officer (DPO) has been appointed, as one is not required for this activity.",
      ],
    },
    {
      id: "dati",
      heading: "What data we process",
      paragraphs: [],
      items: [
        "Browsing data: IP address, browser and device type, pages visited, date and time of the request. Like any web server, the hosting provider records these to run and protect the site.",
        "Contact form data: name, email address, the text of your message and the site language.",
        "Security data: your IP address, stored only in hashed form to limit how often the form can be sent, and technical information about your browser and device analysed by the anti-spam check.",
        "Booking data: the details you enter in the Holidu booking form (for example name, contact details, dates, number of guests, special requests and payment details). Holidu collects them and passes on to us what we need to manage your stay; payment details never reach us.",
        "Guest data: on arrival, the personal and identity-document details of each guest, as required by law.",
        "Data you send us directly, for example by email, phone, WhatsApp or Instagram.",
      ],
      after: [
        "We do not intentionally collect special categories of data (such as health data). If you share any, for example dietary or accessibility needs, we use them only to arrange your stay.",
      ],
    },
    {
      id: "finalita",
      heading: "Why we process it and on what legal basis",
      paragraphs: [],
      items: [
        "Answering your enquiries: steps taken at your request before a contract, and our legitimate interest in replying (Art. 6(1)(b) and (f) GDPR).",
        "Managing your booking and stay: performance of the contract (Art. 6(1)(b)).",
        "Meeting legal obligations: reporting guests’ details to the police through the Alloggiati Web portal (Art. 109 of the Italian Consolidated Public Security Act), tourist tax where applicable, tourism statistics, and tax and accounting obligations (Art. 6(1)(c)).",
        "Protecting the site and contact form from abuse and spam: legitimate interest (Art. 6(1)(f)).",
        "Offering online booking through the Holidu form embedded in the page: steps taken at your request before a contract (Art. 6(1)(b)).",
        "Defending our rights in case of disputes: legitimate interest (Art. 6(1)(f)).",
      ],
      after: [
        "We do not use your data for newsletters, advertising or profiling, we never sell it, and we make no automated decisions that have legal effects on you.",
        "Filling in the contact form is optional, but without your name and email we cannot reply. The details requested at check-in are required by law: without them we cannot host you.",
      ],
    },
    {
      id: "holidu",
      heading: "The Holidu booking form",
      paragraphs: [
        "The booking form is provided by Holidu Hosts GmbH, Riesstraße 24, 80992 Munich (Germany), support@holidu.com, which has appointed a data protection officer (Proliance GmbH). When it loads, your browser connects directly to Holidu’s servers, which may set cookies and use third-party analytics and monitoring tools, including Google Tag Manager and Google Analytics (Google), Microsoft Clarity (which can record interactions with the page, such as clicks and scrolling), customer.io and Sentry. Some of these providers are based in the United States.",
        "The form loads when you reach the Book section. The cookies and tools inside it are managed by Holidu: according to its policy, strictly necessary cookies rely on its legitimate interest, analytics and marketing tools on consent, and Sentry, used to detect errors, keeps data for at most 90 days. We have no access to the data these tools collect.",
        "The details you enter in the form are processed by Holidu as an independent controller, under its privacy policy: {{holidu}}. Holidu passes on to us the booking details we need to manage your stay. Payments are processed for Holidu by Adyen N.V. (Amsterdam, Netherlands). According to its policy, Holidu may also use the booking email address for its own promotional messages, which you can object to at any time by writing to Holidu.",
        "You can also book without the form: by emailing {{email}}, calling {{phone}}, or opening Holidu’s booking page in a new tab. In that case you are visiting Holidu’s own site, which is covered by its privacy and cookie policy.",
      ],
    },
    {
      id: "destinatari",
      heading: "Who we share data with",
      paragraphs: [
        "Your data is processed by us and, on our behalf, by providers acting as data processors, only for the purposes described:",
      ],
      items: [
        "Vercel Inc. (United States): website hosting and technical access logs.",
        "Resend (Plus Five Five, Inc., United States): delivering contact form messages by email.",
        "Cloudflare, Inc. (United States): the Turnstile anti-spam check on the contact form.",
        "Upstash, Inc. (United States; data stored in the European Union): counters that limit form submissions, keyed on the hashed IP address.",
        "Google LLC (United States): the email service (Gmail) where we receive and keep messages.",
        "Our tax adviser, for accounting and tax obligations.",
      ],
      after: [
        "The following are independent controllers: Holidu Hosts GmbH, for the data entered in its form and its cookies; the payment providers Holidu uses, such as Adyen N.V.; and the public authorities we are legally required to report to (police, municipality, statistics bodies, tax authority).",
        "The links to Instagram (Meta Platforms) and Google Maps lead to external services: when you open them, their own privacy policies apply.",
      ],
    },
    {
      id: "trasferimenti",
      heading: "Transfers outside the European Union",
      paragraphs: [
        "Some providers are based in the United States. Data is transferred outside the European Economic Area under the safeguards of Articles 45 and 46 GDPR: the European Commission’s adequacy decision for the EU-U.S. Data Privacy Framework, for providers certified under it, or the Commission’s standard contractual clauses.",
      ],
    },
    {
      id: "conservazione",
      heading: "How long we keep data",
      paragraphs: [],
      items: [
        "Messages and enquiries: as long as needed to reply and manage any relationship that follows, and no longer than 24 months after the last contact.",
        "Booking data and accounting and tax records: 10 years, as required by Italian civil and tax law (Art. 2220 of the Civil Code).",
        "Guest details reported to the police: sent through Alloggiati Web and not kept by us beyond what the law requires for the transmission receipts.",
        "Hashed IP address used for submission limits: 24 hours at most.",
        "Providers’ technical logs: for the short period set by their own policies, for security and operation.",
      ],
    },
    {
      id: "cookie",
      heading: "Cookies",
      paragraphs: [
        "On its own, the site uses only technical cookies, which do not require consent, and contains no analytics or advertising tools of its own.",
        "The Holidu booking form embedded in the Book section may set third-party cookies and use analytics tools, as described in its section above and in the table below. Holidu manages them under its policy: {{holidu}}.",
        "You can block or delete cookies at any time in your browser settings, including third-party cookies only. If you block third-party cookies the booking form may not work; you can then book by email or phone.",
      ],
    },
    {
      id: "diritti",
      heading: "Your rights",
      paragraphs: [
        "At any time you can ask us for access to your data, its correction or erasure, restriction of processing and portability of the data you gave us, and you can object to processing based on legitimate interest (Articles 15–22 GDPR). Where processing is based on your consent, you can withdraw it at any time without affecting processing already carried out (Art. 7(3)). To exercise your rights, write to {{email}}: we will reply within one month.",
        "If you believe the processing breaks the law, you can lodge a complaint with the Italian data protection authority (Garante per la protezione dei dati personali): {{garante}}.",
      ],
    },
    {
      id: "minori",
      heading: "Children",
      paragraphs: [
        "The site is not aimed at children under 14. Bookings must be made by an adult; the data of children staying with us is processed only for the legal obligations connected to the stay.",
      ],
    },
    {
      id: "modifiche",
      heading: "Changes to this notice",
      paragraphs: [
        "We may update this notice, for example if our providers or the law change. The current version is always published on this page, with the date of the last change.",
      ],
    },
  ],
  cookieTable: {
    caption: "Cookies and tools used on the site",
    headers: { name: "Name", provider: "Provider", purpose: "Purpose", duration: "Duration", type: "Type" },
    rows: [
      {
        name: "preferred-locale",
        provider: "Il Casino Casalino (first party)",
        purpose: "Remembers the language you chose",
        duration: "12 months",
        type: "Technical",
      },
      {
        name: "Cloudflare Turnstile",
        provider: "Cloudflare, Inc.",
        purpose: "Tells people apart from automated programs on the contact form",
        duration: "Session",
        type: "Technical",
      },
      {
        name: "uuid and other Holidu cookies",
        provider: "Holidu Hosts GmbH (third party)",
        purpose: "Running the booking form, measurement and analytics",
        duration: "Up to 12 months",
        type: "Third party, managed by Holidu",
      },
      {
        name: "Google Tag Manager / Analytics, Microsoft Clarity, customer.io, Sentry",
        provider: "Google, Microsoft, customer.io, Sentry, via Holidu",
        purpose: "Statistics, behaviour analytics and error monitoring in the booking form",
        duration: "Per the providers’ policies (Sentry: 90 days max)",
        type: "Third party, managed by Holidu; analytics only with consent per its policy",
      },
    ],
  },
  holiduPolicyUrl: "https://www.holidu.com/host/privacy",
  garanteUrl: "https://www.garanteprivacy.it/web/garante-privacy-en",
};
