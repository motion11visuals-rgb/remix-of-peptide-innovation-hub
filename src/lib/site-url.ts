/** The final HTTPS destination verified on the live Vercel site. */
export const SITE_ORIGIN = "https://www.synthesialabsofficial.com";

export function siteUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Site URLs require a local absolute path");
  }
  const url = new URL(path, SITE_ORIGIN);
  if (url.origin !== SITE_ORIGIN) throw new Error("Site URLs must stay on the public domain");
  return url.href;
}