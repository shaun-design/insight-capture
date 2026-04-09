# Prototype auth (shared password)

**All app routes** require a valid session cookie except:

- `/prototype-login` (and its RSC sub-requests)
- `/api/prototype-auth/*` (e.g. logout)

Static assets and `/_next/*` are excluded by the proxy matcher (see `proxy.ts`).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PROTOTYPE_AUTH_USER` | Shared username |
| `PROTOTYPE_AUTH_PASSWORD` | Shared password |
| `PROTOTYPE_AUTH_SECRET` | Random secret used to HMAC-sign the session cookie (e.g. `openssl rand -hex 32`) |

Set all three on Vercel (Production) for **Build** and **Runtime**. If any are missing, protected routes return **503**.

## User flow

1. Visit a protected URL → redirect to `/prototype-login?next=…`
2. Submit username/password → server action sets httpOnly cookie → redirect to `next`
3. **Log Out** → `GET /api/prototype-auth/logout` clears cookie

Legacy `/sign-in` URLs redirect to `/prototype-login`.

This is **not** secure for production (shared credentials, simple cookie). Use only for demos.
