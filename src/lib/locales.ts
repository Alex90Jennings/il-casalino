// Locale constants — a plain (non-client) module so both server code
// (generateStaticParams, redirects) and the client language context can use them.
export type Locale = "it" | "en";

export const LOCALES: Locale[] = ["it", "en"];
export const DEFAULT_LOCALE: Locale = "it";
