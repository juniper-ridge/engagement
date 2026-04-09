import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type RecentPost = Prisma.PostGetPayload<{
  include: { _count: { select: { comments: true } } };
}>;

export default async function AdminDashboard() {
  let totalPosts = 0, publishedPosts = 0, pendingComments = 0, totalLikes = 0;
  let recentPosts: RecentPost[] = [];
  try {
    [totalPosts, publishedPosts, pendingComments, totalLikes] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.comment.count({ where: { approved: false } }),
      prisma.like.count(),
    ]);
    recentPosts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { comments: true } } },
    });
  } catch {
    // DB unavailable — show zeroed stats
  }

  const stats = [
    { label: "Total Posts", value: totalPosts, href: "/admin/posts", color: "text-[#2d5a27]", bg: "bg-[#e8f4e6]" },
    { label: "Published", value: publishedPosts, href: "/admin/posts", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Comments", value: pendingComments, href: "/admin/comments", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Likes", value: totalLikes, href: "/admin/posts", color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a2316]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening with your blog.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center font-bold text-lg mb-3`}>
              {value}
            </div>
            <div className="text-sm text-gray-600 font-medium">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 mb-10">
        <Link
          href="/admin/posts/new"
          className="bg-[#2d5a27] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a8a3f] transition-colors"
        >
          + New Post
        </Link>
        <Link
          href="/admin/comments"
          className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors"
        >
          Review Comments {pendingComments > 0 && `(${pendingComments})`}
        </Link>
      </div>

      {/* Recent posts */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-[#1a2316]">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm text-[#2d5a27] hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentPosts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">No posts yet.</div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#1a2316] text-sm truncate">{post.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString()} · {post._count.comments} comments
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      post.published
                        ? "bg-[#e8f4e6] text-[#2d5a27]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-xs text-gray-500 hover:text-[#2d5a27] transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
