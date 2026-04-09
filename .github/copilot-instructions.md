# Juniper Ridge Landscape — Copilot Instructions

## Project Overview

Next.js 16 (App Router) landscape contractor site with admin CMS, blog, i18n (next-intl), Prisma/SQLite, NextAuth v5, and Tailwind CSS 4.

---

## Core Priorities (in order)

1. **SEO** — Every page must be findable and shareable.
2. **User Experience** — Fast, accessible, and intuitive interactions.
3. **Performance** — Prefer server components; minimize client bundles.
4. **Tests** — Every change must include or update tests (see Testing section).

---

## SEO Requirements

### Every page file must export metadata

```ts
// Static pages
export const metadata: Metadata = {
  title: "Page Title", // shown as "Page Title | Juniper Ridge Landscape"
  description: "...", // 120–160 chars; unique per page
  keywords: ["...", "..."],
  openGraph: {
    title: "Page Title",
    description: "...",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};
```

### Dynamic routes must use `generateMetadata`

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await fetchData(params);
    return {
      title: data.title,
      description: data.excerpt,
      openGraph: { images: [{ url: data.imageUrl }] },
    };
  } catch {
    return {}; // never throw — graceful fallback
  }
}
```

### Rules

- Root layout title template: `"%s | Juniper Ridge Landscape"` — never change this.
- `description` must be unique per page (no duplicates).
- Blog post pages must set `openGraph.images` from the post's `coverImage`.
- Admin routes (`/admin/**`) are excluded from SEO — no metadata needed there.
- Use `export const revalidate = 60` on pages that read from the DB (ISR).
- Add `robots: { index: false }` on any non-public page (admin, staging-only).

---

## Component Conventions

### Server vs. Client split

- Default to **server components** — only add `"use client"` when needed (hooks, browser events, animations).
- Keep client components small and push data fetching up to server parents.

### File structure

```ts
// "use client"  ← only if needed

import ...       ← third-party
import ...       ← @/ aliases

type Props = { ... }  ← explicit Props type for every component

export default function ComponentName({ prop }: Props) { ... }
```

### Typing rules

- `strict: true` is enforced in tsconfig — no `any` unless unavoidable (always add `// eslint-disable-line @typescript-eslint/no-explicit-any` with a comment).
- Use `import type { Foo }` for type-only imports.
- Define local types with `type` (not `interface`) for props and local shapes.
- Use `interface` only for extensible contracts (e.g., Prisma model extensions).

### Tailwind

- Use Tailwind utility classes directly — no CSS-in-JS, no additional component libraries.
- Brand tokens: `#2d5a27` (green-primary), `#1a2316` (text-dark), `#faf8f3` (cream), `#8b6914` (brown-accent).
- Complex conditional classes: use ternary strings, not a `cn()` helper (no `clsx`/`tailwind-merge` installed).

---

## API Route Conventions

### Structure

```ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Public read
export async function GET() { ... }

// Mutation — always auth-guard
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }
  // ... db operation
}
```

### Rules

- All mutating routes (POST/PUT/PATCH/DELETE) must check `auth()` first.
- Validate request bodies with **Zod** before touching the DB.
- Return `NextResponse.json({ error: "..." }, { status: 4xx|5xx })` on failure — never throw unhandled.
- Never expose internal error messages to the client in production — use generic messages for 500s.
- `catch (error)` blocks must log `console.error` server-side and respond with status 500.

---

## Prisma / Database Conventions

- All IDs: `@default(cuid())`
- All timestamps: `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Soft visibility: use `active Boolean @default(true)` — never hard-delete content items.
- Foreign keys: always include `onDelete: Cascade` for child records.
- Singleton models (e.g. `AboutPageSettings`): use `upsert` with a fixed id of `"singleton"`.
- Run `npx prisma migrate dev --name <description>` after schema changes — never edit migrations by hand.

---

## Auth (NextAuth v5)

- Session strategy: JWT.
- Secret: `AUTH_SECRET` env var (falls back to `NEXTAUTH_SECRET` in `auth.ts`).
- Protected pages: guarded by `proxy.ts` (cookie: `authjs.session-token`).
- `(protected)` route group layout runs `await auth()` as a double-guard.
- Login page: uses `window.location.href` (hard navigation) after successful `signIn()` — never `router.push()`.
- Never commit real secrets — `.env` is gitignored.

---

## Infrastructure & Deployment

### Overview

- Deployed to **Render** via **Terraform** (`render-oss/render` provider).
- Two environments: `integration` (branch `develop`) and `production` (branch `main`).
- Terraform state managed by **Terraform Cloud** — workspaces `juniper-ridge-integration` and `juniper-ridge-production`.
- GitHub Actions orchestrates: CI → deploy (via `workflow_run` trigger).

### Terraform file locations

```
terraform/
├── versions.tf          # provider + TF Cloud backend
├── main.tf              # render_web_service resource
├── variables.tf         # all variable declarations
├── outputs.tf           # service URL output
└── environments/
    ├── integration.tfvars   # non-sensitive integration values
    └── production.tfvars    # non-sensitive production values
```

### Adding a new environment variable — checklist

Every new env var must be added in **all four places**:

1. **`.env`** — local development value (never commit real secrets)
2. **`terraform/variables.tf`** — declare the variable (mark `sensitive = true` for secrets)
3. **`terraform/main.tf`** — add to the `env_vars` block in `render_web_service`
4. **`terraform/environments/integration.tfvars`** AND **`production.tfvars`** — for non-sensitive values
5. **`.github/workflows/ci.yml`** — add under both `test:` and `e2e:` job `env:` blocks (use a safe placeholder for CI)

Sensitive values (passwords, API keys, secrets) must be set in the **Terraform Cloud workspace UI** as sensitive workspace variables — never in `.tfvars` files.

### Deployment flow

```
Push to develop → CI workflow (lint + test + e2e) → deploy-integration.yml → terraform apply integration.tfvars
Push to main    → CI workflow (lint + test + e2e) → deploy-production.yml  → terraform apply production.tfvars
```

### Required GitHub secrets

| Secret         | Used by                                                  |
| -------------- | -------------------------------------------------------- |
| `TF_API_TOKEN` | Both deploy workflows — authenticates to Terraform Cloud |

### Required Terraform Cloud workspace variables (sensitive)

Set these in the TF Cloud UI for each workspace (`juniper-ridge-integration` / `juniper-ridge-production`):
`render_api_key`, `render_owner_id`, `auth_secret`, `admin_email`, `admin_password`, `smtp_host`, `smtp_user`, `smtp_password`

---

## Testing Requirements

### Test stack (already configured)

- **Vitest** (`vitest.config.ts`) — unit and component tests, jsdom environment
- **Playwright** (`playwright.config.ts`) — E2E tests in `e2e/`
- **Testing Library** — `@testing-library/react` + `@testing-library/jest-dom`
- Global mocks for `next/navigation`, `next/image`, `next/link`, `next-intl`, `next-auth/react` in `vitest.setup.ts`

```bash
npm test                # Vitest unit + integration (once)
npm run test:watch      # Vitest watch mode
npm run test:coverage   # Vitest with coverage report
npm run test:e2e        # Playwright (requires built app or dev server)
npm run test:e2e:ui     # Playwright interactive UI mode
```

### Unit tests — for pure functions and utilities

Location: `src/lib/__tests__/` or colocated `*.test.ts` next to the file under test.

```ts
// src/lib/__tests__/slug.test.ts
import { describe, it, expect } from "vitest";
import { generateSlug } from "@/lib/slug";

describe("generateSlug", () => {
  it("converts spaces to hyphens", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });
});
```

### Integration tests — for React components

Location: `src/components/__tests__/` or colocated.

```ts
// src/components/__tests__/Navbar.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders the brand name", () => {
    render(<Navbar />);
    expect(screen.getByText(/Juniper Ridge/i)).toBeInTheDocument();
  });
});
```

### API route tests — for route handlers

Location: `src/app/api/**/__tests__/route.test.ts`
Mock `auth()` and Prisma in route tests:

```ts
import { vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/prisma", () => ({ prisma: { post: { findMany: vi.fn() } } }));
```

### E2E tests — for user flows

Location: `e2e/` at project root.

```ts
// e2e/admin-login.spec.ts
import { test, expect } from "@playwright/test";

test("admin can log in", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill(
    '[id="email"]',
    process.env.ADMIN_EMAIL ?? "ci-admin@example.com",
  );
  await page.fill(
    '[id="password"]',
    process.env.ADMIN_PASSWORD ?? "CiTestPassword123!",
  );
  await page.click('[type="submit"]');
  await expect(page).toHaveURL("/admin");
});
```

### Regression tests

- When fixing a bug, add a test that reproduces the broken behavior first, then verify the fix.
- Name the test with the bug context: `it("should not redirect to login when AUTH_SECRET is set", ...)`

### Coverage rules

Every PR/change must include:
| Change type | Required tests |
|---|---|
| New utility function | Unit test |
| New/changed component | Integration test (renders, key interactions) |
| New/changed API route | Integration test (happy path + auth failure + validation failure) |
| New user flow | E2E test |
| Bug fix | Regression test |

---

## Windows-Specific Rules

- **Never use `2>nul` in Git Bash from the project directory.** On Windows, `nul` is a reserved device name; using it in Git Bash creates a literal `nul` file at the `cwd`, which breaks Turbopack (it tries to load it as a CSS dependency). Use `2>/dev/null` instead.
- If a `nul` file appears in the project root, delete it with: `del /F "\\?\C:\path\to\project\nul"` in cmd.exe.

---

## i18n

- Messages live in `messages/` (one JSON file per locale).
- Use `useTranslations()` in client components, `getTranslations()` in server components.
- All user-facing strings should use translation keys — no hardcoded English strings in components.

---

## File Naming

- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx`
- Components: `PascalCase.tsx`
- Utilities/lib: `camelCase.ts`
- Tests: `ComponentName.test.tsx` or `routeName.test.ts`
