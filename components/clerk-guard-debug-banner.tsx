/**
 * Temporary: set `CLERK_DEBUG_GUARD=1` in Vercel (redeploy) to prove the
 * protected layout ran. Remove env + this component after verification.
 */
export function ClerkGuardDebugBanner({ segment }: { segment: string }) {
  if (process.env["CLERK_DEBUG_GUARD"] !== "1") {
    return null;
  }
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-16 z-[200] border-b border-amber-700 bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-950"
    >
      DEBUG: `{segment}` layout ran after `enforceAppSegmentAuth()` — remove{" "}
      <code className="rounded bg-amber-200/80 px-1">CLERK_DEBUG_GUARD</code> when done
    </div>
  );
}
