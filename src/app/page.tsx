import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/locales";

// The site is served under /it and /en. Send the bare root to the default locale.
export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`);
}
