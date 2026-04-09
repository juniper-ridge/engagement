import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type AdminPost = Prisma.PostGetPayload<{
  include: { _count: { select: { comments: true; likes: true } } };
}>;

export default async function AdminPostsPage() {
  let posts: AdminPost[] = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { comments: true, likes: true } },
      },
    });
  } catch {
    // DB unavailable
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a2316]">
            Blog Posts
          </h1>
          <p className="text-gray-500 mt-1">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-[#2d5a27] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a8a3f] transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-4">No posts yet</p>
            <Link href="/admin/posts/new" className="text-[#2d5a27] font-medium hover:underline">
              Create your first post →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Engagement
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#1a2316] line-clamp-1">{post.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">/{post.slug}</div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-[#e8f4e6] text-[#2d5a27]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500 hidden md:table-cell">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4 text-gray-500 hidden lg:table-cell">
                    <div className="flex items-center gap-3 text-xs">
                      <span>❤️ {post._count.likes}</span>
                      <span>💬 {post._count.comments}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-xs text-[#2d5a27] hover:underline font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
