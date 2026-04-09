import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a2316]" style={{ fontFamily: "var(--font-playfair)" }}>
          Edit Post
        </h1>
        <p className="text-gray-500 text-sm mt-1 truncate max-w-xl">
          {post.title}
        </p>
      </div>
      <PostForm
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? "",
          published: post.published,
          tags: post.tags ?? "",
        }}
      />
    </div>
  );
}
