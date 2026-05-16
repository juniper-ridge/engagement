---
name: juniper-prisma-api-conventions
description: Juniper Ridge Prisma and route-handler conventions for schema defaults, Zod validation, auth-guarded mutations, error handling, and tests.
user-invocable: false
---

# Juniper Prisma API Conventions

Use this skill when changing Prisma models, route handlers, route tests, or any DB-backed behavior that needs to match the project's schema and API patterns.

## Apply This Skill For

- Editing `prisma/schema.prisma`
- Adding or changing API routes under `src/app/api`
- Writing route handler tests
- Reviewing Zod validation and server error handling
- Updating content models that feed pages, posts, comments, or CMS behavior

## References

See [prisma-and-routes.md](./prisma-and-routes.md) for:
- Schema conventions used in the repo
- Route handler structure and error rules
- Response and validation patterns
- Test expectations for route changes