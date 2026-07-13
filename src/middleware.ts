import { NextResponse, type NextRequest } from "next/server";
import { LOCALES } from "@/lib/locales";
import { LOCALE_COOKIE, resolveLocale } from "@/lib/locale-detection";

// The site lives under /it and /en. Requests that already target an explicit
// locale route (/it, /en and anything beneath them) are served as-is — never
// redirected — so browser language can never override a chosen locale.
//
// Every other path (notably "/") is redirected to the resolved locale, decided
// entirely server-side to avoid a client-side language flash. Priority:
//   1. a valid `preferred-locale` cookie (a past manual choice)
//   2. the browser's Accept-Language preference
//   3. Italian fallback
// The redirect is temporary (307), so the choice is re-evaluated each visit and
// a later cookie change takes effect immediately.
export function middleware(req: NextRequest) {
  const firstSegment = req.nextUrl.pathname.split("/")[1];
  if ((LOCALES as string[]).includes(firstSegment)) {
    return NextResponse.next();
  }

  const target = resolveLocale(
    req.cookies.get(LOCALE_COOKIE)?.value,
    req.headers.get("accept-language"),
  );

  const url = req.nextUrl.clone();
  url.pathname = `/${target}`;
  return NextResponse.redirect(url); // preserves the query string via clone()
}

export const config = {
  // Run on everything except Next internals, generated media and known root files.
  matcher: ["/((?!_next/|media/|robots.txt|sitemap.xml|logo.png|favicon.ico|sign-preview).*)"],
};
