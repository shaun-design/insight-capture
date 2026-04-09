import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "@/lib/clerk-configured";

/**
 * Server-side enforcement for /admin, /coach, /forms.
 *
 * If `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing from the build (serialized
 * as `publishableKey: ""` on ClerkProvider), `auth.protect()` can throw while
 * building the Clerk redirect — Next surfaces that as a 500. When Clerk is not
 * fully configured, send users to `/sign-in` instead (fix env + redeploy for
 * full hosted sign-in flow).
 */
export async function enforceAppSegmentAuth(): Promise<void> {
  await connection();
  if (process.env["CLERK_DEBUG_GUARD"] === "1") {
    console.info("[clerk-guard] enforceAppSegmentAuth()", new Date().toISOString());
  }
  if (!isClerkConfigured()) {
    redirect("/sign-in");
  }
  await auth.protect();
}
