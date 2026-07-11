// Holidu booking widget URL construction.
//
// The widget resolves its language from the served page's <html lang>, which is
// driven ONLY by the `language` query parameter (verified against the widget's
// i18next language detector and by HTTP probing: `lang`, `locale`, `hl`, `lng`
// and Accept-Language are all ignored). Keep the base URL and the site→Holidu
// language mapping here so nothing arbitrary reaches the external URL.

export type SiteLocale = "en" | "it";

export const HOLIDU_WIDGET_BASE_URL =
  "https://widget.holiduhost.com/widget/dff485ac-a76f-49ef-9ea2-5e78e06bfbc5";

export const HOLIDU_WIDGET_ORIGIN = "https://widget.holiduhost.com";

// Explicit, typed mapping from site locale to Holidu language code.
const HOLIDU_LANGUAGE_BY_LOCALE: Record<SiteLocale, "en" | "it"> = {
  en: "en",
  it: "it",
};

interface BuildOptions {
  /** Standalone full-page layout — used for the "open in a new tab" fallback link. */
  standalone?: boolean;
}

export function buildHoliduWidgetUrl(locale: SiteLocale, { standalone = false }: BuildOptions = {}): string {
  const url = new URL(HOLIDU_WIDGET_BASE_URL);
  if (standalone) url.searchParams.set("standalone", "1");
  // Only ever a fixed, mapped value — never raw input. Unknown locales fall back to English.
  url.searchParams.set("language", HOLIDU_LANGUAGE_BY_LOCALE[locale] ?? "en");
  return url.toString();
}
