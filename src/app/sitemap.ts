import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The site is served under /it and /en; each entry cross-links the other via
// hreflang alternates.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { it: `${SITE_URL}/it`, en: `${SITE_URL}/en` };
  const privacy = { it: `${SITE_URL}/it/privacy`, en: `${SITE_URL}/en/privacy` };
  return [
    { url: `${SITE_URL}/it`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/en`, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
    { url: privacy.it, changeFrequency: "yearly", priority: 0.2, alternates: { languages: privacy } },
    { url: privacy.en, changeFrequency: "yearly", priority: 0.2, alternates: { languages: privacy } },
  ];
}
