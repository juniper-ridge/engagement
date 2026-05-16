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
      <div className="status-message status-message--success">
        {t("commentSuccess")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="authorName" className="field__label">
            {t("commentName")} <span className="field__required">*</span>
          </label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            required
            maxLength={200}
            value={form.authorName}
            onChange={handleChange}
            className="field__control"
          />
        </div>
        <div className="field">
          <label htmlFor="email" className="field__label">
            {t("commentEmail")} <span className="field__required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            value={form.email}
            onChange={handleChange}
            className="field__control"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="content" className="field__label">
          {t("commentMessage")} <span className="field__required">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          maxLength={2000}
          rows={4}
          value={form.content}
          onChange={handleChange}
          className="field__control"
        />
      </div>
      {status === "error" && (
        <div className="status-message status-message--error">
          {t("commentError")}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="button button--primary"
      >
        {status === "submitting" ? t("commentSubmitting") : t("commentSubmit")}
      </button>
    </form>
  );
}
