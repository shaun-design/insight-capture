import { readClerkPublishableKey, readClerkSecretKey } from "@/lib/clerk-env";

/**
 * Clerk middleware and `auth.protect()` both need a valid publishable key to
 * build sign-in redirects. If only `CLERK_SECRET_KEY` is set (common when
 * `NEXT_PUBLIC_*` was not available at build), `auth.protect()` throws and
 * Next returns 500. Require both before running Clerk on the server.
 */
export function isClerkConfigured(): boolean {
  return (
    readClerkSecretKey() !== undefined &&
    readClerkPublishableKey() !== undefined
  );
}
