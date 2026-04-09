import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/clerk-configured";

/**
 * Clerk runs when `readClerkSecretKey()` succeeds (see `lib/clerk-secret.ts`).
 * On Vercel, ensure `CLERK_SECRET_KEY` is available for **Build** and **Runtime**
 * so the proxy bundle is not compiled with an empty secret.
 *
 * App segments under /admin, /coach, /forms always call `auth.protect()` after
 * `connection()` (no env short-circuit).
 */

/** App surfaces that require sign-in when Clerk keys are set. */
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/coach(.*)",
  "/forms(.*)",
]);

const clerk = clerkMiddleware(async (auth, request) => {
  if (!isProtectedRoute(request)) return;
  await auth.protect();
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }
  return clerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
