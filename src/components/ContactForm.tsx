"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name" className="field__label">
            {t("name")} <span className="field__required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={200}
            value={form.name}
            onChange={handleChange}
            placeholder={t("namePlaceholder")}
            className="field__control"
          />
        </div>
        <div className="field">
          <label htmlFor="email" className="field__label">
            {t("email")} <span className="field__required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            value={form.email}
            onChange={handleChange}
            placeholder={t("emailPlaceholder")}
            className="field__control"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone" className="field__label">
          {t("phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          maxLength={50}
          value={form.phone}
          onChange={handleChange}
          placeholder={t("phonePlaceholder")}
          className="field__control"
        />
      </div>

      <div className="field">
        <label htmlFor="message" className="field__label">
          {t("message")} <span className="field__required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder={t("messagePlaceholder")}
          className="field__control"
        />
      </div>

      {status === "success" && (
        <div className="status-message status-message--success">
          {t("success")}
        </div>
      )}
      {status === "error" && (
        <div className="status-message status-message--error">
          {t("error")}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="button button--primary button--block"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
