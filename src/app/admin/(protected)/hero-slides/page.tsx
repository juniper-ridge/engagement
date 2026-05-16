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
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2c3320]">
          Hero Slides
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the homepage hero slideshow. Slides are shown in order.
        </p>
      </div>

      <div className="flex gap-8 items-start">
      {/* ── Left: form + list ───────────────────── */}
      <div className="flex-1 min-w-0">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm"
      >
        <h2 className="font-semibold text-[#2c3320] mb-4">
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]"
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
              className="w-4 h-4 accent-[#5a6e3c]"
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
            className="bg-[#5a6e3c] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#7a9960] transition-colors disabled:opacity-50"
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
                  <span className="font-semibold text-[#2c3320] text-sm">
                    {slide.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${slide.active ? "bg-[#eaf0e4] text-[#5a6e3c]" : "bg-gray-100 text-gray-500"}`}
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
      </div>{/* end left column */}

      {/* ── Right: live preview ──────────────────────────── */}
      <div className="w-80 shrink-0 sticky top-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Slide Preview
        </p>
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video relative bg-gray-900">
          {form.imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${form.imageUrl}')` }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <span className="inline-block bg-white/15 border border-white/30 text-white text-[9px] font-medium px-2 py-0.5 rounded-full mb-2 tracking-wider uppercase">
              Featured Projects
            </span>
            {form.title ? (
              <div className="mb-2">
                <p className="text-[#a3c490] font-semibold text-xs tracking-wide">{form.title}</p>
                {form.subtitle && (
                  <p className="text-white/80 text-[9px] mt-0.5">{form.subtitle}</p>
                )}
              </div>
            ) : (
              <p className="text-white/40 text-[10px] mb-2">slide title will appear here</p>
            )}
            <p className="text-white font-bold text-sm leading-tight">
              Transforming Outdoor
              <br />
              <span className="text-[#a3c490]">Living Spaces</span>
            </p>
          </div>
          {!form.imageUrl && (
            <div className="absolute inset-0 flex items-end justify-center pb-3">
              <p className="text-gray-500 text-[10px]">Enter an image URL to see the preview</p>
            </div>
          )}
        </div>
        {!form.active && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Slide is hidden — won&apos;t appear on site until activated
          </p>
        )}
        <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
          Previews how the slide title and subtitle appear over the hero background image.
        </p>
      </div>
      </div>{/* end flex container */}
    </div>
  );
}
