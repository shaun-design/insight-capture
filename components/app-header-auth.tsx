export function AppHeaderAuth() {
  return (
    <div className="hidden shrink-0 items-center gap-3 md:flex">
      {/* Full document navigation so the session cookie clears before RSC/layout run */}
      <a
        href="/api/prototype-auth/logout"
        className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
      >
        Log Out
      </a>
    </div>
  );
}
