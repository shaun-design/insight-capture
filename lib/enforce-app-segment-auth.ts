import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";

/**
 * Server-side enforcement for /admin, /coach, /forms.
 *
 * Always calls `auth.protect()` (no "is secret present?" short-circuit). A
 * missing `CLERK_SECRET_KEY` at build time used to make that check false so the
 * guard never ran and pages stayed public.
 *
 * Requires `clerkMiddleware` / `proxy.ts` to run so Clerk can set request
 * headers; otherwise `auth()` throws a clear configuration error instead of
 * rendering the app shell.
 */
export async function enforceAppSegmentAuth(): Promise<void> {
  await connection();
  if (process.env["CLERK_DEBUG_GUARD"] === "1") {
    console.info("[clerk-guard] enforceAppSegmentAuth()", new Date().toISOString());
  }
  await auth.protect();
}
