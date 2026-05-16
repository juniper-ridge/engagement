# Juniper CMS Blocks And Drafts

The CMS is a custom block-based page system, not a generic markdown editor. Follow the existing block model and editor flow.

## Block Model

`src/components/cms/types.ts` defines the block union.

Current block families include:

- hero
- heading
- paragraph
- image
- cta
- cards
- hero-carousel
- services
- portfolio
- two-col
- contact-form

When adding a new block type, update the union cleanly and keep the discriminant field as `type`.

## Admin Editor Behavior

`src/app/admin/(protected)/pages/[id]/edit/page.tsx` is the reference workflow.

- The editor is client-side on purpose
- Blocks are created with `makeBlock(type)` defaults
- Block identity is generated with `crypto.randomUUID()` when available
- Inline editing uses a contenteditable wrapper with `onBlur` persistence into local state
- Blocks support add, delete, and reorder behavior

Preserve this editing model unless the task explicitly asks for a broader CMS redesign.

## Rendering And Content Shape

- Keep block objects small and serializable because they are stored as JSON in Prisma
- Prefer appending new optional fields over rewriting the shape of existing blocks
- If a block needs a more complex nested structure, make the nested arrays explicit and typed like the current cards, services, portfolio, and two-column block items

## Page And Draft Storage

`prisma/schema.prisma` stores page content in `Page.content` and draft snapshots in `PageDraft`.

- Published page content should reflect the user-visible version
- Draft content should remain separate from published state
- Draft snapshots are versioned by timestamp and tied to a page id

If a task changes the content model, review both the admin editor and the public rendering path so they do not drift.

## Safe Extension Checklist

- Add the new block type to the TypeScript union
- Add a default factory entry in `makeBlock`
- Add the block to the add-block chooser
- Add render and edit support where needed
- Check that persisted JSON can still be parsed by the existing page flow
- Add or update tests if the behavior changes materially