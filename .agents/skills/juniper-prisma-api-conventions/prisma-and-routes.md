# Juniper Prisma And Route Patterns

This repo uses Prisma with SQLite and Next.js route handlers. Keep changes minimal, typed, and consistent with the existing route files.

## Prisma Schema Defaults

The intended schema conventions are captured in the project instructions and mostly reflected in `prisma/schema.prisma`.

- Use `@default(cuid())` for ids
- Use `createdAt DateTime @default(now())`
- Use `updatedAt DateTime @updatedAt` where records are edited over time
- Use `onDelete: Cascade` for child relations
- Prefer soft visibility via `active Boolean @default(true)` for content that may need to be hidden rather than deleted

When the current schema does not yet follow a convention consistently, prefer extending new work in the intended direction instead of copying old inconsistencies blindly.

## Migration Workflow

- Do not hand-edit generated migration SQL
- After schema changes, create a named migration with `prisma migrate dev`
- Keep generated client artifacts in sync

## Route Handler Structure

The post routes are the reference implementation.

- Import `auth`, `prisma`, `NextResponse`, and `zod`
- Guard every mutation with `auth()` first
- Validate request bodies before DB writes
- Return `NextResponse.json` for success and failure paths
- Catch `ZodError` separately and return `400`
- Log unexpected server errors with `console.error` and return a generic `500`

## Response Shape

Prefer simple, explicit JSON responses.

- `401`: `{ error: "Unauthorized" }`
- `400`: `{ error: "Invalid data.", details: error.issues }` or a route-specific validation error payload
- `500`: `{ error: "Server error." }` or another generic message that does not leak internals

## Route Tests

Any route change should add or update tests.

- Mock `auth` and `prisma`
- Cover the unauthenticated path for protected handlers
- Cover validation failure
- Cover the happy path
- For bug fixes, add a regression test named after the broken behavior

`src/app/api/posts/__tests__/route.test.ts` is the reference test file.

## Review Checklist

- Schema additions use the expected id and timestamp defaults
- Mutations authenticate before touching request payloads or Prisma
- Zod handles request validation
- 500 responses stay generic
- Route tests cover auth failure, validation failure, and success