/**
 * Bracket reads reduce the chance Next.js inlines an empty value at build when
 * the var exists only at runtime on Vercel.
 */
export function readClerkSecretKey(): string | undefined {
  const raw = process.env["CLERK_SECRET_KEY"];
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t.length > 0 ? t : undefined;
}

export function readClerkPublishableKey(): string | undefined {
  const raw = process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"];
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t.length > 0 ? t : undefined;
}
