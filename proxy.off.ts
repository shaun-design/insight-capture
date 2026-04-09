/**
 * Next.js 16+ only runs the root request proxy from a file named `proxy.ts`.
 * This filename is ignored, so Clerk edge auth is off while only this file exists.
 *
 * Disable Clerk at the edge: rename `proxy.ts` → `proxy.off.ts` (or delete `proxy.ts`).
 * Re-enable after Vercel env vars are set: rename this file to `proxy.ts`, or
 * `git checkout HEAD -- proxy.ts` if you removed it.
 *
 * Canonical implementation lives in `proxy.ts` in this repo.
 */
export {};
