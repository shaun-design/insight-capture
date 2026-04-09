# Clerk on Vercel (this repo)

## Environment variables

### Used in **this project’s source**

There are **no** `process.env.*` references to Clerk in application code. The app uses `ClerkProvider`, `SignIn`, `Show`, `SignInButton`, and `useClerk` from `@clerk/nextjs`; those read keys from the environment via the SDK.

### Read by `@clerk/nextjs@7.0.8` (server bundle)

These names appear in `node_modules/@clerk/nextjs/dist/esm/server/constants.js`:

| Variable |
| --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| `CLERK_SECRET_KEY` |
| `CLERK_API_VERSION` |
| `CLERK_ENCRYPTION_KEY` |
| `CLERK_MACHINE_SECRET_KEY` |
| `NEXT_PUBLIC_CLERK_JS_VERSION` |
| `NEXT_PUBLIC_CLERK_JS_URL` |
| `NEXT_PUBLIC_CLERK_UI_URL` |
| `NEXT_PUBLIC_CLERK_UI_VERSION` |
| `NEXT_PUBLIC_CLERK_DOMAIN` |
| `NEXT_PUBLIC_CLERK_PROXY_URL` |
| `NEXT_PUBLIC_CLERK_IS_SATELLITE` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` |
| `NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED` |
| `NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG` |
| `NEXT_PUBLIC_CLERK_KEYLESS_DISABLED` |

`CLERK_API_URL` is derived from the publishable key when unset (same file).

### Vercel checklist

**Required (for sign-in and edge protection to work)**

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — production **pk_live_** key from the Clerk **Production** instance.
- `CLERK_SECRET_KEY` — production **sk_live_** secret from the same instance.

**Optional (Clerk docs: [environment variables](https://clerk.com/docs/guides/development/clerk-environment-variables))**

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` — e.g. `/sign-in` (helps satellite setups; useful to pin paths).
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` — e.g. `/sign-up` if you add a sign-up page.
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` — post-auth fallbacks.
- `NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED=1` — opt out of telemetry.
- `NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG=1` — debug telemetry locally.

**Only if you use that feature**

- `CLERK_ENCRYPTION_KEY` — Next.js dynamic keys in middleware ([Clerk docs](https://clerk.com/docs/reference/nextjs/clerk-middleware#dynamic-keys)).
- `CLERK_MACHINE_SECRET_KEY` — machine / M2M flows.
- `NEXT_PUBLIC_CLERK_DOMAIN` / `NEXT_PUBLIC_CLERK_IS_SATELLITE` — [satellite domains](https://clerk.com/docs/guides/dashboard/dns-domains/satellite-domains).
- `NEXT_PUBLIC_CLERK_PROXY_URL` — [Frontend API proxying](https://clerk.com/docs/guides/dashboard/dns-domains/proxy-fapi).
- `CLERK_WEBHOOK_SIGNING_SECRET` — read by `verifyWebhook()` only; **this repo has no webhook route using it.**

**Not referenced in this repo’s app code**

Any other Clerk vars are SDK-only; add them only if you follow a Clerk guide that requires them.

## `proxy.ts` behavior

- If `CLERK_SECRET_KEY` is missing or blank in the **proxy bundle** (see `lib/clerk-secret.ts`), the proxy calls `NextResponse.next()` and **does not** run `clerkMiddleware`. On Vercel, ensure that variable is enabled for **Build** and **Runtime** so it is not compiled in as empty. `NEXT_PUBLIC_*` must still be set for the browser/Clerk UI.
- If the secret is set, `clerkMiddleware` runs and **`auth.protect()`** applies only to paths matched by:
  - `/admin` and subpaths
  - `/coach` and subpaths
  - `/forms` and subpaths

**Layouts** under those segments call `enforceAppSegmentAuth()` (`connection()` + `auth.protect()` when the secret exists) so enforcement happens on real requests.

**Public without sign-in** (marketing / case study): `/`, `/case-studies`, `/case-studies/*`, `/case-study`, `/sign-in`, `/sign-up`, and any other path not under the three prefixes above.

**When the secret is not set:** `/admin`, `/coach`, and `/forms` are **not** protected at the edge or in layouts.

## Disable / re-enable the edge proxy

- **Disable:** rename `proxy.ts` → `proxy.off.ts` (only `proxy.ts` is loaded by Next.js).
- **Re-enable:** rename back to `proxy.ts` or restore `proxy.ts` from git, then redeploy.

## Clerk Dashboard (two deployment URLs)

Use the **Production** instance keys on Vercel for your live deploys.

Clerk’s UI evolves; use the official [Deployments](https://clerk.com/docs/deployments/overview) and [Domains](https://dashboard.clerk.com/~/domains) docs as the source of truth. In general you need:

1. **Production domain / home URL** aligned with where users open the app (often your canonical custom domain).
2. **DNS / Domains** in Clerk completed for any custom domain that should issue cookies for that host (per Clerk’s Domains page).
3. **OAuth / social providers:** production uses your own client IDs where required; redirect URIs must match what Clerk shows for each provider (update in Google/GitHub/etc. consoles).
4. **Paths** (if you use hosted Account Portal or path settings): sign-in path should match your app (`/sign-in`).

For **both** of these origins you will deploy from the same Vercel project:

| Origin | Notes |
| --- | --- |
| `https://insightcapture.simpleshaun.com` | Custom domain; add in Vercel and Clerk per Domains docs. |
| `https://insight-capture.vercel.app` | Default Vercel URL; ensure Clerk and any OAuth redirect allowlists include this if you use it in production. |

**Allowed origins / redirects (practical checklist)**

- In **Clerk Dashboard → Domains** (and related DNS steps), configure the hostname(s) you actually use in production.
- For **each OAuth provider**, add the **redirect / callback URLs** Clerk displays (they usually include your Frontend API host and your app URLs).
- If Clerk offers a **subdomain allowlist** for cross-subdomain requests, restrict it to hosts you use ([subdomain allowlist](https://clerk.com/docs/guides/dashboard/dns-domains/subdomain-allowlist)).
- Optional hardening: `authorizedParties` in `clerkMiddleware` ([deployments overview](https://clerk.com/docs/deployments/overview)); this repo does not set it to keep preview URLs and multi-host setups simple—add explicit origins if you want stricter CSRF protection.

**Preview deployments (`*.vercel.app` with dynamic names)** often need either a wildcard pattern where Clerk allows it, or testing only on the fixed `insight-capture.vercel.app` / custom domain. Confirm in Clerk’s current dashboard what it accepts for additional origins.
