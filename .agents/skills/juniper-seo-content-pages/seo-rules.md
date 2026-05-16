# Juniper SEO Rules

SEO is the top project priority. When editing or creating public pages, follow the checked-in app behavior first and treat missing metadata as a bug.

## Root Layout Contract

The root layout already defines the global metadata baseline in `src/app/layout.tsx`.

- Keep the title template as `%s | Juniper Ridge Landscape`
- Preserve the global site name, OpenGraph defaults, and JSON-LD business schema unless the user explicitly wants them changed
- Public pages should build on that baseline rather than duplicating the full root metadata object

## Static Public Pages

For page files such as `src/app/page.tsx`, `src/app/about/page.tsx`, and `src/app/contact/page.tsx`:

- Export `metadata`
- Provide a unique description for the page; do not reuse the root description verbatim unless the route is effectively the same content
- Include keywords only when they are clearly page-specific
- Provide OpenGraph title and description when the page is meant to be shared

## Dynamic Routes

For dynamic page files, use `generateMetadata` and never throw from it.

- Resolve params first, because this repo uses async `params` in Next.js 16 patterns
- Catch lookup failures and return `{}`
- If the route reads from Prisma or other content storage, add `export const revalidate = 60` unless there is a strong reason not to cache

The blog post route in `src/app/blog/[slug]/page.tsx` is the reference pattern.

## Blog Post Rules

Blog routes are the most important dynamic SEO path in the current app.

- Use the post title and excerpt in metadata
- Set `openGraph.images` from `post.coverImage`
- Return an empty metadata object when the post is missing rather than surfacing an exception
- Keep the route revalidated at 60 seconds because it reads from the database

## Public vs Non-Public Routes

Do not spend effort on SEO metadata for admin routes.

- `/admin/**` is not a public SEO surface
- Any non-public route should set `robots: { index: false }` if metadata is present
- Public CMS pages and public blog pages should remain indexable

## CMS Page Considerations

The app has managed page content in Prisma.

- If a route renders `Page` records, use the page title and description fields directly when they exist
- If the stored description is missing, generate a concise fallback rather than leaving it blank
- Keep slug-based page metadata aligned with the page content that is actually published

## Verification Checklist

- The page exports `metadata` or `generateMetadata`
- The description is unique and route-specific
- Dynamic content routes return graceful metadata fallbacks
- DB-backed routes use `revalidate = 60`
- Blog posts map `coverImage` into OpenGraph images
- Non-public routes are not accidentally indexable