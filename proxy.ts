import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/clerk-configured";

/**
 * Clerk runs when `CLERK_SECRET_KEY` is set (`isClerkConfigured`). Do not also
 * require `NEXT_PUBLIC_*` here: it is build-inlined and can be missing in this
 * bundle while the secret exists at runtime.
 *
 * App segments under /admin, /coach, /forms call `auth.protect()` after
 * `connection()` so auth runs on real requests, not prerender-only paths.
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
