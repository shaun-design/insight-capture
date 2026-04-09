import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";

/**
 * For /admin, /coach, /forms layouts. Ensures we are not in a prerender/cache-only
 * path, then requires a Clerk session when a secret key is present.
 *
 * Gate on `CLERK_SECRET_KEY` only (not `NEXT_PUBLIC_*`): publishable keys are
 * inlined at build time and can be absent in server bundles even when Vercel
 * provides them at runtime, which previously skipped `auth.protect()` and left
 * app routes public.
 */
export async function enforceAppSegmentAuth(): Promise<void> {
  await connection();
  if (!process.env.CLERK_SECRET_KEY?.trim()) {
    return;
  }
  await auth.protect();
}
