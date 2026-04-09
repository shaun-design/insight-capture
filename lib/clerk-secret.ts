/**
 * Read `CLERK_SECRET_KEY` in a way that avoids Next.js replacing it with an
 * empty string at build time when the secret was only scoped to "Runtime" (or
 * missing during `next build`). Dot access (`process.env.CLERK_SECRET_KEY`) is
 * more aggressively inlined than bracket access.
 */
export function readClerkSecretKey(): string | undefined {
  const raw = process.env["CLERK_SECRET_KEY"];
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t.length > 0 ? t : undefined;
}
