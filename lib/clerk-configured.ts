import { readClerkSecretKey } from "@/lib/clerk-secret";

/**
 * Whether `proxy.ts` should invoke `clerkMiddleware`. Uses bracket-based secret
 * read so the value is less likely to be inlined as empty at build time.
 */
export function isClerkConfigured(): boolean {
  return readClerkSecretKey() !== undefined;
}
