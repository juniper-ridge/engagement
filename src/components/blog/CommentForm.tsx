"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const t = useTranslations("blog");
  const [form, setForm] = useState({ authorName: "", email: "", content: "" });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, ...form }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ authorName: "", email: "", content: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-[#e8f4e6] border border-[#2d5a27]/20 text-[#2d5a27] px-5 py-4 rounded-xl text-sm">
        {t("commentSuccess")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-medium text-[#1a2316] mb-1.5"
          >
            {t("commentName")} <span className="text-red-500">*</span>
          </label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            required
            maxLength={200}
            value={form.authorName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#1a2316] mb-1.5"
          >
            {t("commentEmail")} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] text-sm"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-[#1a2316] mb-1.5"
        >
          {t("commentMessage")} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          maxLength={2000}
          rows={4}
          value={form.content}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] text-sm resize-none"
        />
      </div>
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {t("commentError")}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-[#2d5a27] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#4a8a3f] transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? t("commentSubmitting") : t("commentSubmit")}
      </button>
    </form>
  );
}
