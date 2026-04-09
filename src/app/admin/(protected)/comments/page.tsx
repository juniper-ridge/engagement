import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import CommentsTable from "@/components/admin/CommentsTable";

type CommentWithPost = Prisma.CommentGetPayload<{
  include: { post: { select: { title: true; slug: true } } };
}>;

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  let comments: CommentWithPost[] = [];
  try {
    comments = await prisma.comment.findMany({
      orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
      include: { post: { select: { title: true, slug: true } } },
    });
  } catch {
    // DB unavailable
  }

  const serialized = comments.map((c: CommentWithPost) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  const pendingCount = comments.filter((c: CommentWithPost) => !c.approved).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a2316]" style={{ fontFamily: "var(--font-playfair)" }}>
          Comments
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {pendingCount > 0
            ? `${pendingCount} comment${pendingCount > 1 ? "s" : ""} awaiting approval`
            : "All comments reviewed"}
        </p>
      </div>
      <CommentsTable initialComments={serialized} />
    </div>
  );
}
