import Link from "next/link";

export function AppHeaderAuth() {
  return (
    <div className="hidden shrink-0 items-center gap-3 md:flex">
      <Link
        href="/prototype-login"
        className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Sign In
      </Link>
      <Link
        href="/api/prototype-auth/logout"
        className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
      >
        Log Out
      </Link>
    </div>
  );
}
