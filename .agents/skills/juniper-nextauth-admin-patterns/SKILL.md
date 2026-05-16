---
name: juniper-nextauth-admin-patterns
description: Juniper Ridge admin auth patterns covering NextAuth v5, proxy cookie checks, protected admin routes, and login redirect behavior.
user-invocable: false
---

# Juniper NextAuth Admin Patterns

Use this skill when working on admin authentication, protected routes, login flows, session handling, or auth-guarded admin APIs.

## Apply This Skill For

- Editing `src/lib/auth.ts`
- Changing admin route protection in `src/proxy.ts`
- Updating the admin login page or callback redirect behavior
- Writing or reviewing auth checks in mutating route handlers
- Debugging cookie, session, or redirect issues in `/admin`

## References

See [auth-and-guards.md](./auth-and-guards.md) for:
- NextAuth v5 configuration used by this repo
- Proxy cookie checks and redirect rules
- Admin login page expectations
- Route handler auth ordering
- Testing and review checklist