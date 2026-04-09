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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#1a2316] mb-1.5"
          >
            {t("name")} <span className="text-red-500">*</span>
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent transition text-sm bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#1a2316] mb-1.5"
          >
            {t("email")} <span className="text-red-500">*</span>
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent transition text-sm bg-white"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-[#1a2316] mb-1.5"
        >
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
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent transition text-sm bg-white"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[#1a2316] mb-1.5"
        >
          {t("message")} <span className="text-red-500">*</span>
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
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent transition text-sm bg-white resize-none"
        />
      </div>

      {status === "success" && (
        <div className="bg-[#e8f4e6] border border-[#2d5a27]/20 text-[#2d5a27] text-sm px-4 py-3 rounded-xl">
          {t("success")}
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {t("error")}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-[#2d5a27] text-white py-4 rounded-xl font-semibold hover:bg-[#4a8a3f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
