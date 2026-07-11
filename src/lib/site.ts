// Canonical site origin, used for metadata, canonical URLs, sitemap, robots and
// JSON-LD. Tolerates a base URL entered without a scheme (e.g. Vercel's
// "www.example.com") by ensuring https:// so `new URL()` never throws, and
// strips any trailing slash for consistent concatenation.
const RAW = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ilcasinocasalino.com";

export const SITE_URL = (/^https?:\/\//i.test(RAW) ? RAW : `https://${RAW}`).replace(/\/+$/, "");
