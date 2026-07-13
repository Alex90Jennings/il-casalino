import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/locales";

// Any unmatched route (including invalid locales) redirects to the default locale.
export default function NotFound() {
  redirect(`/${DEFAULT_LOCALE}`);
}
