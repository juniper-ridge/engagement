"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  order: number;
  active: boolean;
};

const emptyForm = {
  title: "",
  subtitle: "",
  imageUrl: "",
  order: 0,
  active: true,
};

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function fetchSlides() {
    const res = await fetch("/api/hero-slides");
    const data = await res.json();
    setSlides(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSlides();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const url = editingId
        ? `/api/hero-slides/${editingId}`
        : "/api/hero-slides";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to save.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchSlides();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
    await fetchSlides();
  }

  async function handleToggleActive(slide: Slide) {
    await fetch(`/api/hero-slides/${slide.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !slide.active }),
    });
    await fetchSlides();
  }

  function startEdit(slide: Slide) {
    setEditingId(slide.id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      imageUrl: slide.imageUrl,
      order: slide.order,
      active: slide.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a2316] font-[family-name:var(--font-playfair)]">
          Hero Slides
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the homepage hero slideshow. Slides are shown in order.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm"
      >
        <h2 className="font-semibold text-[#1a2316] mb-4">
          {editingId ? "Edit Slide" : "Add New Slide"}
        </h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
            />
            {form.imageUrl && (
              <div className="mt-2 relative h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={form.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Garden Retreat — Salt Lake City"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle (optional)
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) =>
                setForm((f) => ({ ...f, subtitle: e.target.value }))
              }
              placeholder="e.g. Hardscape & Planting Design"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((f) => ({ ...f, order: Number(e.target.value) }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="active"
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
              className="w-4 h-4 accent-[#2d5a27]"
            />
            <label
              htmlFor="active"
              className="text-sm font-medium text-gray-700"
            >
              Active (visible on site)
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#2d5a27] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#4a8a3f] transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : editingId ? "Update Slide" : "Add Slide"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setError("");
              }}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Slides list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
          No slides yet. Add one above.
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`bg-white rounded-2xl border p-4 flex gap-4 items-start shadow-sm ${slide.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}
            >
              <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#1a2316] text-sm">
                    {slide.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${slide.active ? "bg-[#e8f4e6] text-[#2d5a27]" : "bg-gray-100 text-gray-500"}`}
                  >
                    {slide.active ? "Active" : "Hidden"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Order: {slide.order}
                  </span>
                </div>
                {slide.subtitle && (
                  <p className="text-gray-500 text-xs mt-1">{slide.subtitle}</p>
                )}
                <p className="text-gray-400 text-xs mt-1 truncate">
                  {slide.imageUrl}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => startEdit(slide)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(slide)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
                >
                  {slide.active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
