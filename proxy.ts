import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/clerk-configured";

/**
 * Clerk is only invoked when both keys are non-empty. If either is missing at
 * runtime, this proxy no-ops so the site still serves (public pages + unguarded
 * app routes). See docs/clerk-vercel.md for which routes require auth when
 * Clerk is configured.
 *
 * Protected App Router segments also call `auth.protect()` in their layouts so
 * auth is enforced at request time (static prerender alone can serve HTML
 * without hitting this proxy reliably).
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
