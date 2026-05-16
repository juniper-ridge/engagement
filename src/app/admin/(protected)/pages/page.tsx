"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageRecord {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  showInNav: boolean;
  updatedAt: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SYSTEM_VIEW_URLS: Record<string, string> = {
  _home: "/",
  _about: "/about",
  _contact: "/contact",
};

function isSystem(slug: string) {
  return slug.startsWith("_");
}

function pageViewUrl(slug: string) {
  return SYSTEM_VIEW_URLS[slug] ?? `/${slug}`;
}

export default function PagesAdminPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [error, setError] = useState("");

  async function load() {
    // Ensure system pages exist (idempotent)
    await fetch("/api/pages/system");
    const res = await fetch("/api/pages");
    if (res.ok) {
      const all: PageRecord[] = await res.json();
      // System pages always at top
      all.sort((a, b) => {
        const aS = isSystem(a.slug) ? 0 : 1;
        const bS = isSystem(b.slug) ? 0 : 1;
        return aS - bS;
      });
      setPages(all);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        slug: newSlug || slugify(newTitle),
        content: [],
      }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Failed to create page");
      return;
    }
    const created = await res.json();
    router.push(`/admin/pages/${created.id}/edit`);
  }

  async function deletePage(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    setPages((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-(family-name:--font-playfair) text-3xl font-bold text-[#2c3320]">
            Pages
          </h1>
          <p className="text-gray-500 mt-1">
            {pages.filter((p) => !isSystem(p.slug)).length} custom page{pages.filter((p) => !isSystem(p.slug)).length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-[#5a6e3c] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7a9960] transition-colors"
        >
          + New Page
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-[#2c3320] mb-4">Create New Page</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={create} className="flex gap-3 flex-wrap items-end">
            <label className="block flex-1 min-w-48">
              <span className="text-xs font-medium text-gray-600 mb-1.5 block">Page Title</span>
              <input
                autoFocus
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30"
                placeholder="e.g. Our Services"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  setNewSlug(slugify(e.target.value));
                }}
              />
            </label>
            <label className="block flex-1 min-w-48">
              <span className="text-xs font-medium text-gray-600 mb-1.5 block">
                URL path — /{newSlug || "…"}
              </span>
              <input
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30"
                placeholder="e.g. our-services"
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#5a6e3c] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#4a5e32] transition-colors"
              >
                Create & Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setError("");
                  setNewTitle("");
                  setNewSlug("");
                }}
                className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4 text-sm">No custom pages yet.</p>
            <button
              onClick={() => setCreating(true)}
              className="text-[#5a6e3c] font-medium hover:underline text-sm"
            >
              Create your first page →
            </button>
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
                  Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#2c3320]">{page.title}</span>
                      {isSystem(page.slug) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2c3320] text-white uppercase tracking-wide">
                          System
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{pageViewUrl(page.slug)}</div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                    >
                      {page.published ? "Published" : "Draft"}
                    </span>
                    {page.showInNav && (
                      <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        In nav
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={pageViewUrl(page.slug)}
                        target="_blank"
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        View ↗
                      </Link>
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="text-xs text-[#5a6e3c] hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      {!isSystem(page.slug) && (
                        <button
                          onClick={() => deletePage(page.id, page.title)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
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
