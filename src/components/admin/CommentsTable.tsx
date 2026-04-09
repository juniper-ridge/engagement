"use client";

import { useState } from "react";

interface Comment {
  id: string;
  authorName: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  post: { title: string; slug: string } | null;
}

interface CommentRowProps {
  comment: Comment;
  onRemove: (id: string) => void;
  onToggle: (id: string, approved: boolean) => void;
}

function CommentRow({ comment, onRemove, onToggle }: CommentRowProps) {
  const [busy, setBusy] = useState(false);

  const handleApprove = async () => {
    setBusy(true);
    await fetch(`/api/comments/${comment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !comment.approved }),
    });
    onToggle(comment.id, !comment.approved);
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    setBusy(true);
    await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
    onRemove(comment.id);
  };

  return (
    <tr className="border-b border-gray-100 align-top hover:bg-gray-50/60 transition-colors">
      <td className="py-4 pr-4 w-56">
        <p className="font-semibold text-sm text-[#1a2316]">
          {comment.authorName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{comment.email}</p>
        <p className="text-xs text-gray-300 mt-1">
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </td>
      <td className="py-4 pr-4">
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
          {comment.content}
        </p>
        {comment.post && (
          <p className="text-xs text-[#2d5a27] mt-1.5 font-medium">
            on: {comment.post.title}
          </p>
        )}
      </td>
      <td className="py-4 pr-4 w-28">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            comment.approved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {comment.approved ? "Approved" : "Pending"}
        </span>
      </td>
      <td className="py-4 w-40">
        <div className="flex flex-col gap-2">
          <button
            disabled={busy}
            onClick={handleApprove}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
              comment.approved
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-[#e8f4e6] text-[#2d5a27] hover:bg-[#2d5a27] hover:text-white"
            }`}
          >
            {comment.approved ? "Unapprove" : "Approve"}
          </button>
          <button
            disabled={busy}
            onClick={handleDelete}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

interface CommentsTableProps {
  initialComments: Comment[];
}

export default function CommentsTable({ initialComments }: CommentsTableProps) {
  const [comments, setComments] = useState(initialComments);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const handleRemove = (id: string) =>
    setComments((prev) => prev.filter((c) => c.id !== id));
  const handleToggle = (id: string, approved: boolean) =>
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved } : c)),
    );

  const visible = comments.filter((c) => {
    if (filter === "pending") return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  const pendingCount = comments.filter((c) => !c.approved).length;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === tab
                ? "bg-[#2d5a27] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
            {tab === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {filter === "pending"
            ? "No pending comments — all caught up!"
            : "No comments found."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4">
                  Author
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4">
                  Comment
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4">
                  Status
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((comment) => (
                <CommentRow
                  key={comment.id}
                  comment={comment}
                  onRemove={handleRemove}
                  onToggle={handleToggle}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
