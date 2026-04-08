"use client";

import { Show, SignInButton, useClerk } from "@clerk/nextjs";

export function AppHeaderAuth() {
  const { signOut } = useClerk();

  return (
    <div className="hidden shrink-0 items-center gap-3 md:flex">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign In
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
        >
          Log Out
        </button>
      </Show>
    </div>
  );
}
