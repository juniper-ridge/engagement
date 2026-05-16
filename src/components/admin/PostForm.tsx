"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
    tags: string;
  };
  mode: "create" | "edit";
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    coverImage: initialData?.coverImage ?? "",
    published: initialData?.published ?? false,
    tags: initialData?.tags ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => {
      const updated = { ...prev, [name]: newValue };
      // Auto-generate slug from title
      if (name === "title" && mode === "create") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url =
        mode === "create" ? "/api/posts" : `/api/posts/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post.");
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (
      !confirm(
        "Are you sure you want to delete this post? This cannot be undone.",
      )
    )
      return;
    const res = await fetch(`/api/posts/${initialData.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#2c3320] mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          maxLength={300}
          value={form.title}
          onChange={handleChange}
          placeholder="Your post title"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a6e3c] text-sm"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-[#2c3320] mb-1.5">
          Slug <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <span className="px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-400">
            /blog/
          </span>
          <input
            name="slug"
            type="text"
            required
            maxLength={300}
            pattern="[a-z0-9-]+"
            value={form.slug}
            onChange={handleChange}
            className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a6e3c] text-sm"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-[#2c3320] mb-1.5">
          Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea
          name="excerpt"
          required
          maxLength={500}
          rows={3}
          value={form.excerpt}
          onChange={handleChange}
          placeholder="A short summary shown in the blog listing"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a6e3c] text-sm resize-none"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-[#2c3320] mb-1.5">
          Cover Image URL
        </label>
        <input
          name="coverImage"
          type="url"
          value={form.coverImage}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a6e3c] text-sm"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-[#2c3320] mb-1.5">
          Tags{" "}
          <span className="text-gray-400 font-normal">(comma-separated)</span>
        </label>
        <input
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          placeholder="garden design, tips, planting"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a6e3c] text-sm"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-[#2c3320] mb-1.5">
          Content (HTML) <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={18}
          value={form.content}
          onChange={handleChange}
          placeholder="<p>Write your post content here. HTML is supported.</p>"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a6e3c] text-sm font-mono resize-y"
        />
        <p className="text-xs text-gray-400 mt-1">
          HTML content. Use standard tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;,
          &lt;img&gt;, etc.
        </p>
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={form.published}
          onChange={handleChange}
          className="w-4 h-4 accent-[#5a6e3c] rounded"
        />
        <label
          htmlFor="published"
          className="text-sm font-medium text-[#2c3320]"
        >
          Publish immediately
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#5a6e3c] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#7a9960] transition-colors disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : mode === "create"
              ? "Create Post"
              : "Save Changes"}
        </button>
        <a
          href="/admin/posts"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </a>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Delete post
          </button>
        )}
      </div>
    </form>
  );
}
