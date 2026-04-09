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
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#1a2316] text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1920&q=80')",
            }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[#2d5a27]/60 border border-[#4a8a3f]/40 text-[#7ec870] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              Blog
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Landscape Insights &<br />
              <span className="text-[#7ec870]">Design Inspiration</span>
            </h1>
            <p className="text-white/75 text-lg">
              Tips, trends, and stories from the Juniper Ridge team.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f3]">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
                <p className="text-lg font-medium">
                  No posts published yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 group flex flex-col"
                  >
                    {post.coverImage && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags
                            .split(",")
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-[#e8f4e6] text-[#2d5a27] px-2.5 py-1 rounded-full font-medium"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                      )}
                      <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1a2316] mb-3 leading-snug group-hover:text-[#2d5a27] transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-400">
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
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
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
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
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
