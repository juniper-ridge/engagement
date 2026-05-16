import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlocksView } from "@/components/cms/BlocksView";
import { PreviewToast } from "@/components/admin/PreviewToast";
import type { ContentBlock } from "@/components/cms/types";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ draftId?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const { draftId } = await searchParams;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  // Determine which content to preview based on the draftId query param:
  // - "live" or absent with no drafts → published content
  // - specific draft ID → that draft's content
  // - absent with drafts → latest draft (default behavior)
  let blocksStr = page.content ?? "[]";
  let latestDraft = null;

  if (draftId && draftId !== "live") {
    const specificDraft = await prisma.pageDraft.findFirst({
      where: { id: draftId, pageId: id },
    });
    if (specificDraft) {
      blocksStr = specificDraft.content;
      latestDraft = specificDraft;
    }
  } else if (draftId !== "live") {
    const newest = await prisma.pageDraft.findFirst({
      where: { pageId: id },
      orderBy: { createdAt: "desc" },
    });
    if (newest) {
      blocksStr = newest.content;
      latestDraft = newest;
    }
  }

  let blocks: ContentBlock[] = [];
  try {
    const parsed = JSON.parse(blocksStr);
    blocks = Array.isArray(parsed) ? parsed : [];
  } catch {
    blocks = [];
  }

  const publicUrl =
    { _home: "/", _about: "/about", _contact: "/contact" }[page.slug] ??
    `/${page.slug}`;

  return (
    <>
      <PreviewToast
        pageTitle={page.title}
        hasDraft={!!latestDraft}
        editorHref={`/admin/pages/${id}/edit`}
        liveHref={page.published ? publicUrl : undefined}
      />
      <Navbar />
      <main className="flex-1">
        <BlocksView blocks={blocks} />
      </main>
      <Footer />
    </>
  );
}
