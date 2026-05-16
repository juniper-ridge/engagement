---
name: juniper-seo-content-pages
description: Juniper Ridge public page SEO rules for metadata, dynamic generateMetadata usage, robots handling, and DB-backed page conventions.
user-invocable: false
---

# Juniper SEO Content Pages

Use this skill when a task touches public page metadata, blog SEO, CMS pages, OpenGraph output, or any route that reads content from the database.

## Apply This Skill For

- Adding or editing metadata on public pages under `src/app`
- Creating dynamic routes that need `generateMetadata`
- Updating blog post metadata or OpenGraph image behavior
- Adding new DB-backed pages or page-like routes that should use ISR
- Reviewing whether a public page follows Juniper Ridge SEO priorities

## Do Not Use This Skill For

- Admin pages under `/admin`
- Pure styling or layout changes that do not affect metadata or crawlability
- Generic Next.js metadata questions not tied to this repo's conventions

## References

See [seo-rules.md](./seo-rules.md) for:
- Root metadata contract and title template
- Static page metadata expectations
- Dynamic route `generateMetadata` behavior
- Blog OpenGraph image rules
- Rules for public versus non-public pages
- DB-backed page caching and verification checklist