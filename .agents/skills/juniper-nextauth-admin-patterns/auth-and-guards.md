# Juniper Auth And Guard Patterns

The repo uses NextAuth v5 credentials auth for the admin CMS. Follow the checked-in auth flow instead of generic NextAuth examples.

## Auth Configuration

`src/lib/auth.ts` is the source of truth.

- Use `AUTH_SECRET` first, then `NEXTAUTH_SECRET` as fallback
- Keep the session strategy as JWT
- Use the credentials provider against Prisma `User`
- Compare passwords with `bcryptjs`
- Enrich JWT and session with `role` and `id`

Do not replace this with database sessions or client-side auth state unless the user explicitly wants an architectural change.

## Proxy Guarding

`src/proxy.ts` protects `/admin` before React renders.

- Look for `authjs.session-token` in development
- Also support `__Secure-authjs.session-token` in production
- Redirect unauthenticated admin traffic to `/admin/login` with `callbackUrl`
- Redirect authenticated users away from `/admin/login` to `/admin`

This repo relies on `proxy.ts`, not legacy `middleware.ts` naming.

## Login Page Behavior

`src/app/admin/login/page.tsx` is a client component by design.

- Keep `signIn("credentials", { redirect: false })`
- On success, navigate with `window.location.href = callbackUrl`
- Do not swap this to `router.push()`; the project instructions explicitly reject that behavior
- Preserve the simple error state for invalid credentials

## Protected Server Layouts

The project instructions require a double-guard pattern.

- `proxy.ts` blocks unauthenticated requests early
- The protected route group layout should also call `await auth()` server-side

If one guard exists and the other does not, treat that as incomplete protection.

## Route Handler Order

For admin mutations and protected admin reads:

1. Call `auth()` first
2. Return `401` immediately when the session is missing
3. Parse or validate input next
4. Touch Prisma only after auth and validation pass

Avoid doing expensive work before the auth check.

## Verification Checklist

- Auth uses JWT strategy and the existing secret fallback
- Proxy checks both dev and secure cookie names
- `/admin/login` keeps hard navigation on success
- Protected route handlers authenticate before validation or DB work
- Session token fields still include admin identity data needed by the CMS