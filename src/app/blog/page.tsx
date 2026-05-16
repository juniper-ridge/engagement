import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type BlogPost = Prisma.PostGetPayload<{
  include: {
    author: { select: { name: true } };
    _count: { select: { comments: true; likes: true } };
  };
}>;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Landscape insights, design inspiration, and expert tips from the Juniper Ridge team.",
};

export const revalidate = 60; // ISR — re-fetch data every 60 seconds

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        _count: {
          select: { comments: { where: { approved: true } }, likes: true },
        },
      },
    });
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="site-main">
        <section aria-labelledby="blog-page-heading" className="editorial-hero">
          <div
            aria-hidden="true"
            className="editorial-hero__media"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1920&q=80')",
            }}
          />
          <div className="editorial-hero__inner">
            <span className="section-badge">
              Blog
            </span>
            <h1 id="blog-page-heading" className="editorial-hero__title">
              Landscape Insights &<br />
              <span className="accent-emphasis">Design Inspiration</span>
            </h1>
            <p className="editorial-hero__text">
              Tips, trends, and stories from the Juniper Ridge team.
            </p>
          </div>
        </section>

        <section aria-label="Blog posts" className="section section--cream">
          <div className="section__inner">
            {posts.length === 0 ? (
              <div className="empty-state">
                <svg
                  aria-hidden="true"
                  className="empty-state__icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <p className="empty-state__text">
                  No posts published yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="blog-grid">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    aria-labelledby={`post-title-${post.id}`}
                    className="blog-card"
                  >
                    {post.coverImage && (
                      <div className="blog-card__media">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="blog-card__image"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="blog-card__body">
                      {post.tags && (
                        <div className="tag-row">
                          {post.tags
                            .split(",")
                            .slice(0, 3)
                            .map((tag) => (
                              <span key={tag} className="tag-pill">
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                      )}
                      <h2 id={`post-title-${post.id}`} className="blog-card__title">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="blog-card__text">
                        {post.excerpt}
                      </p>
                      <div className="blog-card__footer">
                        <div className="blog-card__meta">
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                          {" · "}by {post.author.name}
                        </div>
                        <div className="metric-row blog-card__meta">
                          <span aria-label={`${post._count.likes} likes`} className="metric">
                            <svg
                              aria-hidden="true"
                              className="button__icon"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            {post._count.likes}
                          </span>
                          <span aria-label={`${post._count.comments} comments`} className="metric">
                            <svg
                              aria-hidden="true"
                              className="button__icon"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            {post._count.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
