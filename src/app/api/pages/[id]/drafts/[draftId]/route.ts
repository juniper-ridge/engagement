import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; draftId: string }> },
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, draftId } = await params;

  // Verify draft belongs to this page
  const draft = await prisma.pageDraft.findFirst({
    where: { id: draftId, pageId: id },
  });
  if (!draft)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.pageDraft.delete({ where: { id: draftId } });

  // Return updated drafts list
  const drafts = await prisma.pageDraft.findMany({
    where: { pageId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, content: true, createdAt: true },
  });

  return NextResponse.json({ drafts });
}
