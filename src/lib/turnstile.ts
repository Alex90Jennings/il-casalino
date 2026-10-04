// Cloudflare Turnstile — the contact form's bot check. Server-only: the site key
// is read here and passed down to the form as a prop, because client components
// only see env vars that are inlined at build time. Unset switches the widget off; the matching
// TURNSTILE_SECRET_KEY is read only by the server action.
export function turnstileSiteKey(): string | null {
  return process.env.TURNSTILE_SITE_KEY?.trim() || null;
}

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(secret: string, token: string, remoteIp: string | null): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const result = (await res.json()) as { success?: boolean; action?: string };
    return result.success === true && (result.action === undefined || result.action === "contact");
  } catch {
    return false;
  }
}
