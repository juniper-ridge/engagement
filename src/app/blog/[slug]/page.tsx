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
      <main id="main-content" className="site-main">
        <section aria-labelledby="post-hero-heading" className="post-hero">
          {post.coverImage && (
            <div
              aria-hidden="true"
              className="post-hero__media"
              style={{ backgroundImage: `url('${post.coverImage}')` }}
            />
          )}
          <div className="post-hero__inner">
            {post.tags && (
              <div className="tag-row">
                {post.tags.split(",").map((tag) => (
                  <span key={tag} className="tag-pill tag-pill--hero">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            <h1 id="post-hero-heading" className="post-hero__title">
              {post.title}
            </h1>
            <p className="post-hero__meta">
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

        {post.coverImage && (
          <div className="post-cover-wrap">
            <div className="post-cover">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="blog-card__image"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        )}

        <article className="post-content">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="post-actions">
            <LikeButton postId={post.id} initialCount={post._count.likes} />
            <ShareButton title={post.title} />
            <Link
              href="/blog"
              className="button button--soft post-actions__spacer"
            >
              <svg
                className="button__icon"
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

        <section aria-labelledby="comments-heading" className="section section--cream comments-section">
          <div className="comments-shell">
            <h2 id="comments-heading" className="comment-form__title">
              {post.comments.length} Comment
              {post.comments.length !== 1 ? "s" : ""}
            </h2>

            {post.comments.length === 0 ? (
              <p className="empty-state__text">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="comment-list">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-avatar">
                      {comment.authorName.charAt(0)}
                    </div>
                    <div>
                      <div>
                        <div className="comment-card__author">
                          {comment.authorName}
                        </div>
                        <div className="comment-card__meta">
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
                      <p className="comment-card__body">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="surface-panel comment-form-shell">
              <h3 className="comment-form__title">
                Leave a Comment
              </h3>
              <p className="section-subtitle section-intro--left">
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
