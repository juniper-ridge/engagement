import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikeButton from "@/components/blog/LikeButton";
import ShareButton from "@/components/blog/ShareButton";
import CommentForm from "@/components/blog/CommentForm";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { slug, published: true },
    });
    if (!post) return {};
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await prisma.post.findUnique({
      where: { slug, published: true },
      include: {
        author: { select: { name: true } },
        comments: {
          where: { approved: true },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true } },
      },
    });
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-28 pb-12 bg-[#1a2316] text-white">
          {post.coverImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25"
              style={{ backgroundImage: `url('${post.coverImage}')` }}
            />
          )}
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            {post.tags && (
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                {post.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#2d5a27]/60 border border-[#4a8a3f]/40 text-[#7ec870] px-3 py-1 rounded-full font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-white/70 text-sm">
              Posted on{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · by {post.author.name}
            </p>
          </div>
        </section>

        {/* Cover image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <div
            className="prose prose-lg prose-headings:font-[family-name:var(--font-playfair)] prose-a:text-[#2d5a27] prose-img:rounded-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Actions */}
          <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-3">
            <LikeButton postId={post.id} initialCount={post._count.likes} />
            <ShareButton title={post.title} />
            <Link
              href="/blog"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:border-gray-300 transition-colors ml-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </article>

        {/* Comments */}
        <section className="bg-[#faf8f3] py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a2316] mb-8">
              {post.comments.length} Comment
              {post.comments.length !== 1 ? "s" : ""}
            </h2>

            {post.comments.length === 0 ? (
              <p className="text-gray-500 text-sm mb-10">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-6 mb-12">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#e8f4e6] text-[#2d5a27] flex items-center justify-center font-bold text-sm uppercase">
                        {comment.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1a2316] text-sm">
                          {comment.authorName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment form */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1a2316] mb-6">
                Leave a Comment
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Comments are moderated and will appear after approval.
              </p>
              <CommentForm postId={post.id} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
