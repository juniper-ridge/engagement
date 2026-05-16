import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getPageWithDrafts(id: string) {
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return null;
  const drafts = await prisma.pageDraft.findMany({
    where: { pageId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, content: true, createdAt: true },
  });
  return {
    ...page,
    drafts,
    latestDraftContent: drafts[0]?.content ?? null,
    hasDraft: drafts.length > 0,
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const page = await getPageWithDrafts(id);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Publish action: promote a specific or latest PageDraft → page.content, delete all drafts
  if (body.publish === true) {
    const existing = await prisma.page.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let contentToPublish = existing.content;
    if (body.draftId) {
      // Publish a specific draft by ID
      const draft = await prisma.pageDraft.findFirst({
        where: { id: body.draftId, pageId: id },
      });
      if (draft) contentToPublish = draft.content;
    } else {
      const latestDraft = await prisma.pageDraft.findFirst({
        where: { pageId: id },
        orderBy: { createdAt: "desc" },
      });
      if (latestDraft) contentToPublish = latestDraft.content;
    }
    await prisma.page.update({
      where: { id },
      data: { content: contentToPublish, published: true },
    });
    await prisma.pageDraft.deleteMany({ where: { pageId: id } });
    const page = await getPageWithDrafts(id);
    return NextResponse.json(page);
  }

  // Unpublish action
  if (body.unpublish === true) {
    await prisma.page.update({ where: { id }, data: { published: false } });
    const page = await getPageWithDrafts(id);
    return NextResponse.json(page);
  }

  // Regular update: meta fields saved live; content saved as a new PageDraft snapshot
  await prisma.page.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.showInNav !== undefined && { showInNav: body.showInNav }),
      ...(body.navLabel !== undefined && { navLabel: body.navLabel }),
    },
  });

  if (body.content !== undefined) {
    const contentStr =
      typeof body.content === "string"
        ? body.content
        : JSON.stringify(body.content);

    // Create new draft snapshot
    await prisma.pageDraft.create({ data: { pageId: id, content: contentStr } });

    // Prune: keep only the 2 most recent drafts for this page
    const allDrafts = await prisma.pageDraft.findMany({
      where: { pageId: id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (allDrafts.length > 2) {
      await prisma.pageDraft.deleteMany({
        where: { id: { in: allDrafts.slice(2).map((d) => d.id) } },
      });
    }
  }

  const page = await getPageWithDrafts(id);
  return NextResponse.json(page);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.page.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
