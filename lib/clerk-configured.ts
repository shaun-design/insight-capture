/**
 * Whether Clerk middleware should run in `proxy.ts`.
 *
 * Uses `CLERK_SECRET_KEY` only: `NEXT_PUBLIC_*` is embedded at build time and can
 * be empty in the server/middleware bundle on some deploys even when the
 * dashboard lists the variable, which incorrectly skipped protection before.
 */
export function isClerkConfigured(): boolean {
  return Boolean(process.env.CLERK_SECRET_KEY?.trim());
}
