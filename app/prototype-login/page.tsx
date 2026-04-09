import Link from "next/link";
import { prototypeLoginAction } from "./actions";

type Props = {
  searchParams?: Promise<{ next?: string; error?: string }>;
};

export default async function PrototypeLoginPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const next = sp.next && !sp.next.startsWith("//") && sp.next.startsWith("/")
    ? sp.next
    : "/admin";
  const err = sp.error;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="mb-2 text-xl font-semibold text-neutral-900">
        Prototype sign-in
      </h1>
      <p className="mb-6 text-sm text-neutral-600">
        Shared credentials for admin, coach, and forms demos. Not for production
        use.
      </p>

      {err === "1" && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Invalid username or password.
        </p>
      )}
      {err === "config" && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Auth environment variables are not set on the server.
        </p>
      )}

      <form action={prototypeLoginAction} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Username</span>
          <input
            name="user"
            type="text"
            autoComplete="username"
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-[#0a6ab1] focus:ring-1 focus:ring-[#0a6ab1]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-[#0a6ab1] focus:ring-1 focus:ring-[#0a6ab1]"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-[#0a6ab1] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Sign in
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        <Link href="/" className="text-[#0a6ab1] underline-offset-2 hover:underline">
          Back to case study
        </Link>
      </p>
    </main>
  );
}
