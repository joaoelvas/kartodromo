// Absolute base URL of the deployed site, used for Open Graph / share metadata
// (WhatsApp needs absolute image URLs). Set NEXT_PUBLIC_SERVER_URL in production;
// Railway also exposes RAILWAY_PUBLIC_DOMAIN automatically.
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL
  if (explicit) return explicit.replace(/\/$/, '')
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  return 'http://localhost:3000'
}
