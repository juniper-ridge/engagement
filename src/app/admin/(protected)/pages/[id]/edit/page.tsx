"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type {
  ContentBlock,
  HeroBlock,
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  CtaBlock,
  CardsBlock,
  HeroCarouselBlock,
  ServicesBlock,
  PortfolioBlock,
  TwoColBlock,
  ContactFormBlock,
} from "@/components/cms/types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function uid() {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function makeBlock(type: string): ContentBlock {
  const id = uid();
  switch (type) {
    case "hero":
      return {
        id, type: "hero", tagline: "Welcome", title: "Your Page Headline",
        titleAccent: "In Green Accent", subtitle: "Add a compelling subtitle that describes what visitors will find on this page.",
        imageUrl: "", ctaLabel: "Get In Touch", ctaHref: "/contact",
      };
    case "heading":
      return { id, type: "heading", level: 2, text: "Section Heading", accent: "", centered: false };
    case "paragraph":
      return { id, type: "paragraph", text: "Write your content here. Click directly on this text to edit it, just like a word processor.", centered: false };
    case "image":
      return { id, type: "image", url: "", alt: "", caption: "", fullWidth: false };
    case "cta":
      return { id, type: "cta", heading: "Ready to Get Started?", subtext: "Contact us today to discuss your project.", buttonLabel: "Get In Touch", buttonHref: "/contact", bg: "green" };
    case "cards":
      return {
        id, type: "cards", heading: "Key Features",
        items: [
          { id: uid(), heading: "First Card", body: "Click to edit this card description." },
          { id: uid(), heading: "Second Card", body: "Click to edit this card description." },
          { id: uid(), heading: "Third Card", body: "Click to edit this card description." },
        ],
      };
    case "hero-carousel":
      return { id, type: "hero-carousel" };
    case "services":
      return {
        id, type: "services",
        sectionLabel: "What I Do",
        heading: "Our Services",
        subtext: "Comprehensive landscape design for your outdoor space.",
        items: [
          { id: uid(), iconKey: "design", title: "Landscape Design", description: "Click to edit this service description." },
          { id: uid(), iconKey: "planting", title: "Planting Plans", description: "Click to edit this service description." },
          { id: uid(), iconKey: "hardscape", title: "Hardscape Design", description: "Click to edit this service description." },
        ],
      };
    case "portfolio":
      return {
        id, type: "portfolio",
        sectionLabel: "Our Work",
        heading: "Featured Projects",
        subtext: "A selection of our recent work.",
        items: [
          { id: uid(), title: "Project Title", category: "Category", imageUrl: "" },
          { id: uid(), title: "Project Title", category: "Category", imageUrl: "" },
          { id: uid(), title: "Project Title", category: "Category", imageUrl: "" },
        ],
      };
    case "two-col":
      return {
        id, type: "two-col",
        imageUrl: "",
        imagePosition: "right" as const,
        sectionLabel: "Our Story",
        heading: "Section Heading",
        paragraphs: [
          { id: uid(), text: "Click to edit this paragraph." },
          { id: uid(), text: "Add more paragraphs as needed." },
        ],
      };
    case "contact-form":
      return {
        id, type: "contact-form",
        tagline: "Contact",
        heading: "Get In Touch",
        headingAccent: "",
        subtext: "Ready to transform your outdoor space? We\'d love to hear from you.",
        heroImageUrl: "",
      };
    default:
      throw new Error("Unknown block type");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EditableText — contenteditable div that looks like its styled context
// ─────────────────────────────────────────────────────────────────────────────

function EditableText({
  value,
  onChange,
  className = "",
  placeholderClass = "cms-editable-light",
  placeholder = "Click to edit…",
  singleLine = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholderClass?: string;
  placeholder?: string;
  singleLine?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set content only on initial mount. Keyed by block.id so it remounts when block changes.
  useEffect(() => {
    if (ref.current) ref.current.innerText = value ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={`focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-inset rounded cursor-text ${placeholderClass} ${className}`}
      onBlur={(e) => onChange(e.currentTarget.innerText ?? "")}
      onKeyDown={(e) => {
        if (singleLine && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Block wrapper — shows hover controls
// ─────────────────────────────────────────────────────────────────────────────

const BLOCK_LABELS: Record<string, string> = {
  hero: "Hero", "hero-carousel": "Slider", heading: "Heading", paragraph: "Text",
  image: "Image", cta: "CTA", cards: "Cards", services: "Services",
  portfolio: "Portfolio", "two-col": "Two Col", "contact-form": "Contact",
};

function getBlockLabel(block: ContentBlock) {
  return BLOCK_LABELS[block.type] ?? block.type;
}

function truncateText(value: string, maxLength = 56) {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
}

function getBlockPreview(block: ContentBlock) {
  switch (block.type) {
    case "hero":
      return block.title || block.subtitle || "Hero section";
    case "heading":
      return block.text || "Section heading";
    case "paragraph":
      return truncateText(block.text || "Paragraph copy");
    case "image":
      return block.alt || block.caption || (block.url ? "Image selected" : "No image selected");
    case "cta":
      return block.heading || block.buttonLabel || "Call to action";
    case "cards":
      return `${block.items.length} card${block.items.length === 1 ? "" : "s"}`;
    case "hero-carousel":
      return "Managed from Hero Slides";
    case "services":
      return `${block.items.length} service${block.items.length === 1 ? "" : "s"}`;
    case "portfolio":
      return `${block.items.length} project${block.items.length === 1 ? "" : "s"}`;
    case "two-col":
      return block.heading || `${block.paragraphs.length} paragraph${block.paragraphs.length === 1 ? "" : "s"}`;
    case "contact-form":
      return block.heading || block.subtext || "Contact section";
    default:
      return "Content block";
  }
}

function formatSavedTime(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function BlockWrapper({
  block, index, total, selected, onSelect, onMoveUp, onMoveDown, onDelete, blockRef, children,
}: {
  block: ContentBlock; index: number; total: number;
  selected: boolean; onSelect: () => void;
  onMoveUp: () => void; onMoveDown: () => void; onDelete: () => void;
  blockRef?: (node: HTMLDivElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={blockRef}
      data-block-id={block.id}
      className="relative group/block scroll-mt-28"
      onClickCapture={onSelect}
    >
      {/* Hover outline */}
      <div
        className={`absolute inset-0 ring-2 ring-inset transition-opacity pointer-events-none z-10 rounded-sm ${
          selected
            ? "ring-[#5a6e3c] opacity-100"
            : "ring-blue-400 opacity-0 group-hover/block:opacity-100"
        }`}
      />

      {/* Toolbar */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
          {BLOCK_LABELS[block.type] ?? block.type}
        </span>
        <button
          onClick={onMoveUp} disabled={index === 0}
          title="Move up"
          className="bg-white border border-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 shadow-sm text-xs"
        >▲</button>
        <button
          onClick={onMoveDown} disabled={index === total - 1}
          title="Move down"
          className="bg-white border border-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 shadow-sm text-xs"
        >▼</button>
        <button
          onClick={onDelete}
          title="Delete block"
          className="bg-white border border-red-200 text-red-600 w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 shadow-sm text-xs"
        >✕</button>
      </div>

      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add-block button
// ─────────────────────────────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: "hero", label: "Hero Section", desc: "Full-width hero with image, headline, CTA" },
  { type: "hero-carousel", label: "Hero Slider", desc: "Rotating slides (manage in Hero Slides admin)" },
  { type: "heading", label: "Heading", desc: "Section title with optional accent label" },
  { type: "paragraph", label: "Text / Paragraph", desc: "Body text paragraph" },
  { type: "two-col", label: "Two Column", desc: "Image + text side by side" },
  { type: "image", label: "Image", desc: "Full or contained image with caption" },
  { type: "services", label: "Services Grid", desc: "Icon cards grid of services" },
  { type: "portfolio", label: "Portfolio Grid", desc: "Image grid with hover labels" },
  { type: "cta", label: "Call to Action", desc: "Prominent CTA section with button" },
  { type: "cards", label: "Cards Grid", desc: "Grid of cards with heading and body" },
  { type: "contact-form", label: "Contact Form", desc: "Hero + contact form + business info" },
];

function AddBlockButton({ onAdd }: { onAdd: (type: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative flex justify-center py-3 group/add">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 group-hover/add:bg-blue-200 transition-colors" />
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 flex items-center gap-1.5 bg-white border border-gray-200 group-hover/add:border-blue-300 group-hover/add:text-blue-600 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full shadow-sm hover:shadow transition-all"
      >
        <span className="text-base leading-none">+</span> Add Block
      </button>
      {open && (
        <div className="absolute top-full mt-1 z-50 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 w-72">
          {BLOCK_TYPES.map(({ type, label, desc }) => (
            <button
              key={type}
              onClick={() => { onAdd(type); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="text-sm font-medium text-[#2c3320]">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual block editors
// ─────────────────────────────────────────────────────────────────────────────

function HeroEditor({ block, onChange }: { block: HeroBlock; onChange: (b: HeroBlock) => void }) {
  const [editingImage, setEditingImage] = useState(false);
  const [imgDraft, setImgDraft] = useState(block.imageUrl);
  const [editingCta, setEditingCta] = useState(false);

  return (
    <section className="relative min-h-72 flex flex-col items-center justify-center text-center overflow-hidden bg-[#2c3320]">
      {block.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${block.imageUrl}')` }}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/50 pointer-events-none" />

      {/* Image control */}
      <div className="absolute top-3 left-3 z-20">
        {editingImage ? (
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-2">
            <input
              className="text-sm border border-gray-200 rounded px-2 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30"
              value={imgDraft}
              onChange={(e) => setImgDraft(e.target.value)}
              placeholder="https://…"
              autoFocus
            />
            <button onClick={() => { onChange({ ...block, imageUrl: imgDraft }); setEditingImage(false); }} className="bg-[#5a6e3c] text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-[#4a5e32]">Save</button>
            <button onClick={() => setEditingImage(false)} className="text-gray-400 hover:text-gray-600 text-xs px-1">✕</button>
          </div>
        ) : (
          <button onClick={() => { setImgDraft(block.imageUrl); setEditingImage(true); }} className="text-xs bg-black/40 backdrop-blur text-white px-3 py-1.5 rounded-lg hover:bg-black/60 transition-colors flex items-center gap-1.5">
            🖼 {block.imageUrl ? "Change Image" : "Add Image"}
          </button>
        )}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-20 w-full">
        <EditableText
          key={`tagline-${block.id}`}
          value={block.tagline}
          onChange={(v) => onChange({ ...block, tagline: v })}
          singleLine
          placeholderClass="cms-editable-dark"
          placeholder="Tagline pill text"
          className="inline-block bg-[#5a6e3c]/60 border border-[#7a9960]/40 text-[#a3c490] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
        />
        <EditableText
          key={`title-${block.id}`}
          value={block.title}
          onChange={(v) => onChange({ ...block, title: v })}
          singleLine
          placeholderClass="cms-editable-dark"
          placeholder="Main title line 1"
          className="block font-(family-name:--font-playfair) text-4xl sm:text-5xl font-bold text-white leading-tight mx-auto"
        />
        <EditableText
          key={`titleAccent-${block.id}`}
          value={block.titleAccent}
          onChange={(v) => onChange({ ...block, titleAccent: v })}
          singleLine
          placeholderClass="cms-editable-dark"
          placeholder="Title line 2 — shown in green (leave empty to hide)"
          className="block font-(family-name:--font-playfair) text-4xl sm:text-5xl font-bold text-[#a3c490] leading-tight mb-5 mx-auto"
        />
        <EditableText
          key={`subtitle-${block.id}`}
          value={block.subtitle}
          onChange={(v) => onChange({ ...block, subtitle: v })}
          placeholderClass="cms-editable-dark"
          placeholder="Subtitle paragraph"
          className="block text-white/75 text-lg max-w-2xl mx-auto leading-relaxed mb-8"
        />
        {/* CTA button */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <EditableText
              key={`ctaLabel-${block.id}`}
              value={block.ctaLabel}
              onChange={(v) => onChange({ ...block, ctaLabel: v })}
              singleLine
              placeholderClass="cms-editable-dark"
              placeholder="Button label"
              className="bg-[#5a6e3c] text-white px-6 py-3 rounded-full font-semibold text-sm"
            />
            <button onClick={() => setEditingCta((o) => !o)} className="text-xs bg-black/30 text-white px-2 py-1 rounded hover:bg-black/50">⚙ URL</button>
          </div>
          {editingCta && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
              <span className="text-white/50 text-xs">href=</span>
              <input
                className="bg-white/20 text-white text-sm px-2 py-1 rounded border border-white/30 focus:outline-none w-40"
                value={block.ctaHref}
                onChange={(e) => onChange({ ...block, ctaHref: e.target.value })}
                placeholder="/contact"
              />
              <button onClick={() => setEditingCta(false)} className="text-white/60 hover:text-white text-xs">Done</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HeadingEditor({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  return (
    <section className="py-12 px-8 bg-white">
      <div className={`max-w-4xl mx-auto ${block.centered ? "text-center" : ""}`}>
        {/* Controls */}
        <div className="flex items-center gap-3 mb-3 opacity-60 hover:opacity-100 transition-opacity">
          <select
            value={block.level}
            onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 })}
            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e3c]/30"
          >
            <option value={2}>H2 — Large</option>
            <option value={3}>H3 — Medium</option>
          </select>
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            <input type="checkbox" checked={block.centered} onChange={(e) => onChange({ ...block, centered: e.target.checked })} className="accent-[#5a6e3c]" />
            Centered
          </label>
        </div>
        <EditableText
          key={`accent-${block.id}`}
          value={block.accent}
          onChange={(v) => onChange({ ...block, accent: v })}
          singleLine
          placeholder="Small label above heading (optional)"
          className="text-[#5a6e3c] font-semibold text-sm uppercase tracking-widest block mb-2"
        />
        <EditableText
          key={`text-${block.id}`}
          value={block.text}
          onChange={(v) => onChange({ ...block, text: v })}
          singleLine
          placeholder="Section heading text"
          className={`font-(family-name:--font-playfair) font-bold text-[#2c3320] ${block.level === 2 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}
        />
      </div>
    </section>
  );
}

function ParagraphEditor({ block, onChange }: { block: ParagraphBlock; onChange: (b: ParagraphBlock) => void }) {
  return (
    <section className="py-8 px-8 bg-white">
      <div className={`max-w-3xl mx-auto ${block.centered ? "text-center" : ""}`}>
        <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 opacity-60 hover:opacity-100 transition-opacity w-fit">
          <input type="checkbox" checked={block.centered} onChange={(e) => onChange({ ...block, centered: e.target.checked })} className="accent-[#5a6e3c]" />
          Centered
        </label>
        <EditableText
          key={`text-${block.id}`}
          value={block.text}
          onChange={(v) => onChange({ ...block, text: v })}
          placeholder="Write your paragraph text here…"
          className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap"
        />
      </div>
    </section>
  );
}

function ImageEditor({ block, onChange }: { block: ImageBlock; onChange: (b: ImageBlock) => void }) {
  const [editing, setEditing] = useState(!block.url);
  const [draft, setDraft] = useState(block.url);

  return (
    <div className={`${block.fullWidth ? "w-full" : "max-w-4xl mx-auto px-8"} py-8 bg-white`}>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-3 opacity-60 hover:opacity-100 transition-opacity flex-wrap">
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          <input type="checkbox" checked={block.fullWidth} onChange={(e) => onChange({ ...block, fullWidth: e.target.checked })} className="accent-[#5a6e3c]" />
          Full width
        </label>
        <button onClick={() => { setDraft(block.url); setEditing(true); }} className="text-xs text-blue-600 hover:text-blue-800">Change Image URL</button>
      </div>
      {editing && (
        <div className="flex items-center gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://…image.jpg"
            autoFocus
          />
          <button onClick={() => { onChange({ ...block, url: draft }); setEditing(false); }} className="bg-[#5a6e3c] text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-[#4a5e32]">Save</button>
          {block.url && <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 text-xs px-1">✕</button>}
        </div>
      )}
      {block.url ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.alt || ""} className="w-full rounded-2xl object-cover max-h-120" />
          <div className="mt-2 space-y-1">
            <input
              className="w-full text-xs border-0 border-b border-gray-100 px-0 py-1 focus:outline-none focus:border-[#5a6e3c] text-gray-500"
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              placeholder="Alt text (for accessibility)…"
            />
            <input
              className="w-full text-xs border-0 border-b border-gray-100 px-0 py-1 focus:outline-none focus:border-[#5a6e3c] text-gray-500 text-center"
              value={block.caption}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              placeholder="Caption (optional)…"
            />
          </div>
        </figure>
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
          Enter an image URL above
        </div>
      )}
    </div>
  );
}

function CtaEditor({ block, onChange }: { block: CtaBlock; onChange: (b: CtaBlock) => void }) {
  const [editingBtn, setEditingBtn] = useState(false);
  const bgClass = block.bg === "green" ? "bg-[#5a6e3c]" : block.bg === "dark" ? "bg-[#2c3320]" : "bg-[#faf8f3]";
  const textClass = block.bg === "light" ? "text-[#2c3320]" : "text-white";
  const placeholderClass = block.bg === "light" ? "cms-editable-light" : "cms-editable-dark";
  const btnClass = block.bg === "green" ? "bg-white text-[#5a6e3c]" : "bg-[#5a6e3c] text-white";

  return (
    <section className={`py-16 px-8 ${bgClass}`}>
      {/* Controls row */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity bg-black/10 rounded-lg px-3 py-1.5">
          <span className="text-xs text-white/80">Background:</span>
          {(["green", "dark", "light"] as const).map((bg) => (
            <button key={bg} onClick={() => onChange({ ...block, bg })} className={`text-xs px-2 py-0.5 rounded capitalize ${block.bg === bg ? "bg-white text-[#2c3320] font-semibold" : "text-white/60 hover:text-white"}`}>{bg}</button>
          ))}
        </div>
      </div>
      <div className="max-w-2xl mx-auto text-center">
        <EditableText
          key={`heading-${block.id}`}
          value={block.heading}
          onChange={(v) => onChange({ ...block, heading: v })}
          singleLine
          placeholderClass={placeholderClass}
          placeholder="CTA heading"
          className={`font-(family-name:--font-playfair) text-4xl font-bold ${textClass} mb-4 block`}
        />
        <EditableText
          key={`subtext-${block.id}`}
          value={block.subtext}
          onChange={(v) => onChange({ ...block, subtext: v })}
          singleLine
          placeholderClass={placeholderClass}
          placeholder="Supporting text (optional)"
          className={`text-lg mb-8 block ${block.bg === "light" ? "text-gray-600" : "text-white/75"}`}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <EditableText
              key={`btnLabel-${block.id}`}
              value={block.buttonLabel}
              onChange={(v) => onChange({ ...block, buttonLabel: v })}
              singleLine
              placeholderClass="cms-editable-light"
              placeholder="Button label"
              className={`px-8 py-3 rounded-full font-semibold text-sm ${btnClass}`}
            />
            <button onClick={() => setEditingBtn((o) => !o)} className="text-xs bg-black/20 text-white px-2 py-1 rounded hover:bg-black/40">⚙ URL</button>
          </div>
          {editingBtn && (
            <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2">
              <span className="text-white/60 text-xs">href=</span>
              <input className="bg-white/20 text-white text-sm px-2 py-1 rounded border border-white/30 focus:outline-none w-40" value={block.buttonHref} onChange={(e) => onChange({ ...block, buttonHref: e.target.value })} placeholder="/contact" />
              <button onClick={() => setEditingBtn(false)} className="text-white/60 hover:text-white text-xs">Done</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CardsEditor({ block, onChange }: { block: CardsBlock; onChange: (b: CardsBlock) => void }) {
  const updateItem = (idx: number, heading: string, body: string) => {
    const items = block.items.map((it, i) => i === idx ? { ...it, heading, body } : it);
    onChange({ ...block, items });
  };
  const addCard = () => onChange({ ...block, items: [...block.items, { id: uid(), heading: "New Card", body: "Card description." }] });
  const removeCard = (idx: number) => onChange({ ...block, items: block.items.filter((_, i) => i !== idx) });

  return (
    <section className="py-16 px-8 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto">
        <EditableText
          key={`heading-${block.id}`}
          value={block.heading}
          onChange={(v) => onChange({ ...block, heading: v })}
          singleLine
          placeholder="Section heading (optional)"
          className="font-(family-name:--font-playfair) text-4xl sm:text-5xl font-bold text-[#2c3320] text-center mb-10 block"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.items.map((item, idx) => (
            <div key={item.id} className="relative group/card bg-white rounded-2xl p-8 border border-gray-100">
              <button
                onClick={() => removeCard(idx)}
                className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity w-5 h-5 bg-red-100 text-red-600 rounded text-xs flex items-center justify-center hover:bg-red-200"
              >✕</button>
              <EditableText
                key={`heading-${item.id}`}
                value={item.heading}
                onChange={(v) => updateItem(idx, v, item.body)}
                singleLine
                placeholder="Card heading"
                className="font-(family-name:--font-playfair) font-bold text-xl text-[#2c3320] mb-3 block"
              />
              <EditableText
                key={`body-${item.id}`}
                value={item.body}
                onChange={(v) => updateItem(idx, item.heading, v)}
                placeholder="Card description"
                className="text-gray-600 leading-relaxed text-sm"
              />
            </div>
          ))}
          <button
            onClick={addCard}
            className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#5a6e3c] hover:border-[#5a6e3c] transition-colors text-sm font-medium"
          >
            + Add Card
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// New block editors
// ─────────────────────────────────────────────────────────────────────────────

const EDITOR_ICON_PATHS: Record<string, string> = {
  design: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  hardscape: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  planting: "M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 010 10 5 5 0 010-10z",
  leaf: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  default: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

function HeroCarouselEditor({ block }: { block: HeroCarouselBlock }) {
  void block;
  return (
    <div className="bg-[#2c3320] py-20 text-center">
      <div className="text-white/40 text-xs uppercase tracking-widest mb-3">Block: Hero Slider</div>
      <div className="text-white font-bold text-3xl mb-3">Rotating Hero Slides</div>
      <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">
        Slide content (images, titles, subtitles) is managed in the Hero Slides admin section.
      </p>
      <a
        href="/admin/hero-slides"
        className="inline-block bg-[#5a6e3c] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#7a9960] transition-colors font-medium"
      >
        Manage Hero Slides →
      </a>
    </div>
  );
}

function ServicesEditor({ block, onChange }: { block: ServicesBlock; onChange: (b: ServicesBlock) => void }) {
  const updateItem = (idx: number, patch: Partial<ServicesBlock["items"][0]>) => {
    const items = block.items.map((it, i) => i === idx ? { ...it, ...patch } : it);
    onChange({ ...block, items });
  };
  const addItem = () => onChange({ ...block, items: [...block.items, { id: uid(), iconKey: "default", title: "New Service", description: "Click to edit." }] });
  const removeItem = (idx: number) => onChange({ ...block, items: block.items.filter((_, i) => i !== idx) });

  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section controls */}
        <div className="text-center mb-10">
          <EditableText key={`sl-${block.id}`} value={block.sectionLabel} onChange={(v) => onChange({ ...block, sectionLabel: v })} singleLine placeholder="Section label (optional)" className="text-[#5a6e3c] font-semibold text-sm uppercase tracking-widest block mb-2" />
          <EditableText key={`h-${block.id}`} value={block.heading} onChange={(v) => onChange({ ...block, heading: v })} singleLine placeholder="Services heading" className="font-(family-name:--font-playfair) text-4xl font-bold text-[#2c3320] block mb-3" />
          <EditableText key={`sub-${block.id}`} value={block.subtext} onChange={(v) => onChange({ ...block, subtext: v })} singleLine placeholder="Subtext (optional)" className="text-gray-500 text-lg block" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.items.map((item, idx) => (
            <div key={item.id} className="relative group/si bg-white border border-gray-200 rounded-2xl p-6">
              <button
                onClick={() => removeItem(idx)}
                className="absolute top-2 right-2 opacity-0 group-hover/si:opacity-100 transition-opacity w-5 h-5 bg-red-100 text-red-600 rounded text-xs flex items-center justify-center hover:bg-red-200"
              >✕</button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#eaf0e4] text-[#5a6e3c] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={EDITOR_ICON_PATHS[item.iconKey] ?? EDITOR_ICON_PATHS.default} />
                  </svg>
                </div>
                <select
                  value={item.iconKey}
                  onChange={(e) => updateItem(idx, { iconKey: e.target.value })}
                  className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e3c]/30"
                >
                  <option value="design">Design</option>
                  <option value="hardscape">Hardscape</option>
                  <option value="planting">Planting</option>
                  <option value="leaf">Leaf</option>
                  <option value="star">Star</option>
                  <option value="default">Generic</option>
                </select>
              </div>
              <EditableText key={`t-${item.id}`} value={item.title} onChange={(v) => updateItem(idx, { title: v })} singleLine placeholder="Service title" className="font-(family-name:--font-playfair) font-bold text-[#2c3320] text-lg mb-2 block" />
              <EditableText key={`d-${item.id}`} value={item.description} onChange={(v) => updateItem(idx, { description: v })} placeholder="Service description" className="text-gray-500 text-sm leading-relaxed" />
            </div>
          ))}
          <button
            onClick={addItem}
            className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 flex items-center justify-center text-gray-400 hover:text-[#5a6e3c] hover:border-[#5a6e3c] transition-colors text-sm font-medium min-h-40"
          >+ Add Service</button>
        </div>
      </div>
    </section>
  );
}

function PortfolioEditor({ block, onChange }: { block: PortfolioBlock; onChange: (b: PortfolioBlock) => void }) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [imgDraft, setImgDraft] = useState("");

  const updateItem = (idx: number, patch: Partial<PortfolioBlock["items"][0]>) => {
    const items = block.items.map((it, i) => i === idx ? { ...it, ...patch } : it);
    onChange({ ...block, items });
  };
  const addItem = () => onChange({ ...block, items: [...block.items, { id: uid(), title: "Project Title", category: "Category", imageUrl: "" }] });
  const removeItem = (idx: number) => onChange({ ...block, items: block.items.filter((_, i) => i !== idx) });

  return (
    <section className="py-16 px-8 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <EditableText key={`sl-${block.id}`} value={block.sectionLabel} onChange={(v) => onChange({ ...block, sectionLabel: v })} singleLine placeholder="Section label" className="text-[#5a6e3c] font-semibold text-sm uppercase tracking-widest block mb-2" />
          <EditableText key={`h-${block.id}`} value={block.heading} onChange={(v) => onChange({ ...block, heading: v })} singleLine placeholder="Portfolio heading" className="font-(family-name:--font-playfair) text-4xl font-bold text-[#2c3320] block mb-3" />
          <EditableText key={`sub-${block.id}`} value={block.subtext} onChange={(v) => onChange({ ...block, subtext: v })} singleLine placeholder="Subtext (optional)" className="text-gray-500 text-lg block" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {block.items.map((item, idx) => (
            <div key={item.id} className="relative group/pi">
              <button onClick={() => removeItem(idx)} className="absolute top-2 left-2 z-10 opacity-0 group-hover/pi:opacity-100 transition-opacity w-5 h-5 bg-red-600 text-white rounded text-xs flex items-center justify-center hover:bg-red-700">✕</button>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
                )}
              </div>
              {editingIdx === idx ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#5a6e3c]/30"
                    value={imgDraft}
                    onChange={(e) => setImgDraft(e.target.value)}
                    placeholder="https://… image URL"
                    autoFocus
                  />
                  <button onClick={() => { updateItem(idx, { imageUrl: imgDraft }); setEditingIdx(null); }} className="bg-[#5a6e3c] text-white text-xs px-2 py-1 rounded">✓</button>
                  <button onClick={() => setEditingIdx(null)} className="text-gray-400 text-xs px-1">✕</button>
                </div>
              ) : (
                <button
                  onClick={() => { setImgDraft(item.imageUrl); setEditingIdx(idx); }}
                  className="w-full text-xs text-blue-600 hover:text-blue-700 text-left mt-1.5 px-0.5"
                >🖼 {item.imageUrl ? "Change image" : "Set image URL"}</button>
              )}
              <EditableText key={`t-${item.id}`} value={item.title} onChange={(v) => updateItem(idx, { title: v })} singleLine placeholder="Project title" className="font-semibold text-[#2c3320] text-sm mt-1 block" />
              <EditableText key={`c-${item.id}`} value={item.category} onChange={(v) => updateItem(idx, { category: v })} singleLine placeholder="Category" className="text-[#5a6e3c] text-xs font-medium" />
            </div>
          ))}
          <button onClick={addItem} className="aspect-4/3 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#5a6e3c] hover:border-[#5a6e3c] transition-colors text-sm font-medium">+ Add Item</button>
        </div>
      </div>
    </section>
  );
}

function TwoColEditor({ block, onChange }: { block: TwoColBlock; onChange: (b: TwoColBlock) => void }) {
  const [editingImg, setEditingImg] = useState(false);
  const [imgDraft, setImgDraft] = useState(block.imageUrl);

  const updateParagraph = (idx: number, text: string) => {
    const paragraphs = block.paragraphs.map((p, i) => i === idx ? { ...p, text } : p);
    onChange({ ...block, paragraphs });
  };
  const addParagraph = () => onChange({ ...block, paragraphs: [...block.paragraphs, { id: uid(), text: "New paragraph text." }] });
  const removeParagraph = (idx: number) => onChange({ ...block, paragraphs: block.paragraphs.filter((_, i) => i !== idx) });

  const textEl = (
    <div className="flex flex-col justify-center space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 mb-1 opacity-60 hover:opacity-100 transition-opacity flex-wrap">
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="font-medium">Image:</span>
          <button
            onClick={() => { setImgDraft(block.imagePosition === "left" ? "right" : "left"); onChange({ ...block, imagePosition: block.imagePosition === "left" ? "right" : "left" }); }}
            className="text-xs border border-gray-200 rounded px-2 py-0.5 bg-white hover:bg-gray-50"
          >
            {block.imagePosition === "left" ? "← Left" : "Right →"}
          </button>
        </label>
        <button onClick={() => { setImgDraft(block.imageUrl); setEditingImg(true); }} className="text-xs text-blue-600 hover:text-blue-700">🖼 {block.imageUrl ? "Change image" : "Set image URL"}</button>
      </div>
      {editingImg && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <input
            className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30"
            value={imgDraft}
            onChange={(e) => setImgDraft(e.target.value)}
            placeholder="https://… image URL"
            autoFocus
          />
          <button onClick={() => { onChange({ ...block, imageUrl: imgDraft }); setEditingImg(false); }} className="bg-[#5a6e3c] text-white text-xs px-3 py-2 rounded font-medium">Save</button>
          <button onClick={() => setEditingImg(false)} className="text-gray-400 text-xs px-1">✕</button>
        </div>
      )}
      <EditableText key={`sl-${block.id}`} value={block.sectionLabel} onChange={(v) => onChange({ ...block, sectionLabel: v })} singleLine placeholder="Section label" className="text-[#5a6e3c] font-semibold text-sm uppercase tracking-widest block" />
      <EditableText key={`h-${block.id}`} value={block.heading} onChange={(v) => onChange({ ...block, heading: v })} singleLine placeholder="Heading" className="font-(family-name:--font-playfair) text-3xl font-bold text-[#2c3320] block leading-tight" />
      {block.paragraphs.map((p, idx) => (
        <div key={p.id} className="relative group/para">
          <button onClick={() => removeParagraph(idx)} className="absolute -right-1 -top-1 opacity-0 group-hover/para:opacity-100 transition-opacity w-4 h-4 bg-red-100 text-red-600 rounded text-[10px] flex items-center justify-center hover:bg-red-200 z-10">✕</button>
          <EditableText key={`p-${p.id}`} value={p.text} onChange={(v) => updateParagraph(idx, v)} placeholder="Paragraph text" className="text-gray-600 leading-relaxed" />
        </div>
      ))}
      <button onClick={addParagraph} className="text-xs text-[#5a6e3c] hover:text-[#7a9960] font-medium self-start">+ Add paragraph</button>
    </div>
  );

  const imageEl = (
    <div className="relative overflow-hidden rounded-2xl aspect-4/3 bg-gray-100">
      {block.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.imageUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Set image URL above</div>
      )}
    </div>
  );

  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {block.imagePosition === "left" ? <>{imageEl}{textEl}</> : <>{textEl}{imageEl}</>}
      </div>
    </section>
  );
}

function ContactFormEditor({ block, onChange }: { block: ContactFormBlock; onChange: (b: ContactFormBlock) => void }) {
  const [editingImg, setEditingImg] = useState(false);
  const [imgDraft, setImgDraft] = useState(block.heroImageUrl);

  return (
    <section className="relative min-h-64 flex flex-col items-center justify-center text-center bg-[#2c3320] overflow-hidden">
      {block.heroImageUrl && (
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${block.heroImageUrl}')` }} />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/40 pointer-events-none" />

      {/* Image control */}
      <div className="absolute top-3 left-3 z-20">
        {editingImg ? (
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-2">
            <input
              className="text-sm border border-gray-200 rounded px-2 py-1 w-64 focus:outline-none"
              value={imgDraft}
              onChange={(e) => setImgDraft(e.target.value)}
              placeholder="https://… hero image"
              autoFocus
            />
            <button onClick={() => { onChange({ ...block, heroImageUrl: imgDraft }); setEditingImg(false); }} className="bg-[#5a6e3c] text-white text-xs px-3 py-1.5 rounded font-medium">Save</button>
            <button onClick={() => setEditingImg(false)} className="text-gray-400 text-xs px-1">✕</button>
          </div>
        ) : (
          <button onClick={() => { setImgDraft(block.heroImageUrl); setEditingImg(true); }} className="text-xs bg-black/40 backdrop-blur text-white px-3 py-1.5 rounded-lg hover:bg-black/60 flex items-center gap-1.5">
            🖼 {block.heroImageUrl ? "Change Image" : "Add Image"}
          </button>
        )}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-20 w-full">
        <EditableText key={`tag-${block.id}`} value={block.tagline} onChange={(v) => onChange({ ...block, tagline: v })} singleLine placeholderClass="cms-editable-dark" placeholder="Tagline pill" className="inline-block bg-[#5a6e3c]/60 border border-[#7a9960]/40 text-[#a3c490] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest" />
        <EditableText key={`h-${block.id}`} value={block.heading} onChange={(v) => onChange({ ...block, heading: v })} singleLine placeholderClass="cms-editable-dark" placeholder="Main heading" className="block font-(family-name:--font-playfair) text-5xl font-bold text-white mb-2" />
        <EditableText key={`ha-${block.id}`} value={block.headingAccent} onChange={(v) => onChange({ ...block, headingAccent: v })} singleLine placeholderClass="cms-editable-dark" placeholder="Heading accent line (green, optional)" className="block font-(family-name:--font-playfair) text-5xl font-bold text-[#a3c490] mb-5" />
        <EditableText key={`sub-${block.id}`} value={block.subtext} onChange={(v) => onChange({ ...block, subtext: v })} placeholderClass="cms-editable-dark" placeholder="Subtitle text" className="block text-white/70 text-lg max-w-xl mx-auto" />
        <div className="mt-8 inline-block bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white/50 text-sm">
          ↓ Contact form &amp; business info rendered below
        </div>
      </div>
    </section>
  );
}

function BlockEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  switch (block.type) {
    case "hero":         return <HeroEditor    block={block} onChange={onChange as (b: HeroBlock)      => void} />;
    case "heading":      return <HeadingEditor block={block} onChange={onChange as (b: HeadingBlock)   => void} />;
    case "paragraph":    return <ParagraphEditor block={block} onChange={onChange as (b: ParagraphBlock) => void} />;
    case "image":        return <ImageEditor   block={block} onChange={onChange as (b: ImageBlock)     => void} />;
    case "cta":          return <CtaEditor     block={block} onChange={onChange as (b: CtaBlock)       => void} />;
    case "cards":        return <CardsEditor   block={block} onChange={onChange as (b: CardsBlock)     => void} />;
    case "hero-carousel": return <HeroCarouselEditor block={block} />;
    case "services":     return <ServicesEditor   block={block} onChange={onChange as (b: ServicesBlock)   => void} />;
    case "portfolio":    return <PortfolioEditor  block={block} onChange={onChange as (b: PortfolioBlock)  => void} />;
    case "two-col":      return <TwoColEditor     block={block} onChange={onChange as (b: TwoColBlock)     => void} />;
    case "contact-form": return <ContactFormEditor block={block} onChange={onChange as (b: ContactFormBlock) => void} />;
    default:             return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page settings panel
// ─────────────────────────────────────────────────────────────────────────────

interface PageMeta {
  title: string;
  slug: string;
  description: string;
  published: boolean;
  showInNav: boolean;
  navLabel: string;
}

function SettingsPanel({
  meta, onClose, onChange, onSave, saving,
}: {
  meta: PageMeta; onClose: () => void;
  onChange: (m: PageMeta) => void; onSave: () => void; saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-96 h-full bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#2c3320]">Page Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <label className="block">
            <span className="text-xs font-medium text-gray-600 mb-1.5 block">Page Title</span>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30" value={meta.title} onChange={(e) => onChange({ ...meta, title: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-600 mb-1.5 block">URL Slug (/{meta.slug})</span>
            {meta.slug.startsWith("_") ? (
              <div className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50">
                {{"_home": "/", "_about": "/about", "_contact": "/contact"}[meta.slug] ?? `/${meta.slug}`} — system page path
              </div>
            ) : (
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30" value={meta.slug} onChange={(e) => onChange({ ...meta, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
            )}
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-600 mb-1.5 block">Meta Description</span>
            <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30 resize-none" value={meta.description} onChange={(e) => onChange({ ...meta, description: e.target.value })} placeholder="Brief description for search engines…" />
          </label>
          <div className="space-y-3 pt-1">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-[#2c3320]">Live Status</div>
                  <div className="text-xs text-amber-700/80">Publishing and unpublishing happen from the editor toolbar.</div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.published ? "bg-green-100 text-green-800" : "bg-white text-amber-700 border border-amber-200"}`}>
                  {meta.published ? "Published" : "Draft only"}
                </span>
              </div>
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={meta.showInNav} onChange={(e) => onChange({ ...meta, showInNav: e.target.checked })} className="w-4 h-4 accent-[#5a6e3c]" />
              <div>
                <div className="text-sm font-medium text-[#2c3320]">Show in Navigation</div>
                <div className="text-xs text-gray-400">Add a link in the site navbar</div>
              </div>
            </label>
          </div>
          {meta.showInNav && (
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1.5 block">Nav Label (leave empty to use page title)</span>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30" value={meta.navLabel} onChange={(e) => onChange({ ...meta, navLabel: e.target.value })} placeholder={meta.title} />
            </label>
          )}
          <button
            onClick={() => { onSave(); onClose(); }}
            disabled={saving}
            className="w-full bg-[#5a6e3c] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#4a5e32] transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? "Saving…" : "Save Page Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Version history panel
// ─────────────────────────────────────────────────────────────────────────────

interface DraftEntry {
  id: string;
  content: string;
  createdAt: string;
}

function VersionHistoryPanel({
  drafts,
  liveContent,
  activeVersionId,
  published,
  onSwitch,
  onDelete,
  onClose,
}: {
  drafts: DraftEntry[];
  liveContent: string;
  activeVersionId: string;
  published: boolean;
  onSwitch: (versionId: string, content: string) => void;
  onDelete: (draftId: string) => void;
  onClose: () => void;
}) {
  function fmtDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    });
  }

  function blockCount(content: string) {
    try {
      const arr = JSON.parse(content);
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-96 h-full bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#2c3320]">Version History</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {/* Live / published version */}
          <button
            onClick={() => onSwitch("live", liveContent)}
            className={`w-full text-left rounded-xl border p-4 transition-all ${
              activeVersionId === "live"
                ? "border-[#5a6e3c] bg-[#eff4ea] ring-1 ring-[#5a6e3c]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${published ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="font-medium text-sm text-[#2c3320]">
                {published ? "Published Version" : "Last Published"}
              </span>
              {activeVersionId === "live" && (
                <span className="ml-auto text-xs bg-[#5a6e3c] text-white px-2 py-0.5 rounded-full">Active</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {blockCount(liveContent)} block{blockCount(liveContent) !== 1 ? "s" : ""} · Live content
            </div>
          </button>

          {drafts.length > 0 && (
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-2">
              Drafts
            </div>
          )}

          {/* Draft versions (newest first) */}
          {drafts.map((draft, idx) => (
            <div
              key={draft.id}
              className={`rounded-xl border transition-all ${
                activeVersionId === draft.id
                  ? "border-[#5a6e3c] bg-[#eff4ea] ring-1 ring-[#5a6e3c]"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <button
                onClick={() => onSwitch(draft.id, draft.content)}
                className="w-full text-left p-4 pb-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-medium text-sm text-[#2c3320]">
                    Draft {drafts.length - idx}
                  </span>
                  {idx === 0 && (
                    <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Latest
                    </span>
                  )}
                  {activeVersionId === draft.id && (
                    <span className="ml-auto text-xs bg-[#5a6e3c] text-white px-2 py-0.5 rounded-full">Active</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {blockCount(draft.content)} block{blockCount(draft.content) !== 1 ? "s" : ""} · {fmtDate(draft.createdAt)}
                </div>
              </button>
              <div className="px-4 pb-3 flex justify-end">
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(draft.id); }}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete draft
                </button>
              </div>
            </div>
          ))}

          {drafts.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">
              No drafts yet. Changes are auto-saved as drafts.
            </p>
          )}

          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              Up to 2 drafts are kept per page. Switching versions loads that content into the editor — save to keep your changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockOutline({
  blocks,
  activeBlockId,
  published,
  hasDraft,
  activeVersionId,
  dirty,
  saving,
  lastSavedAt,
  onJump,
}: {
  blocks: ContentBlock[];
  activeBlockId: string | null;
  published: boolean;
  hasDraft: boolean;
  activeVersionId: string;
  dirty: boolean;
  saving: boolean;
  lastSavedAt: string | null;
  onJump: (blockId: string) => void;
}) {
  const lastSavedLabel = formatSavedTime(lastSavedAt);

  return (
    <aside className="rounded-[28px] border border-[#d8dccd] bg-[#faf8f3] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-(family-name:--font-playfair) text-2xl font-bold text-[#2c3320]">
            Page Outline
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {blocks.length} block{blocks.length === 1 ? "" : "s"} in this page
          </p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
          saving
            ? "bg-blue-100 text-blue-700"
            : dirty
              ? "bg-amber-100 text-amber-700"
              : hasDraft
                ? "bg-green-100 text-green-800"
                : "bg-white text-gray-600 border border-gray-200"
        }`}>
          {saving ? "Saving" : dirty ? "Autosave pending" : hasDraft ? "Draft ready" : "Synced"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="rounded-2xl bg-white px-3 py-2.5 border border-white/80">
          <div className="font-semibold text-[#2c3320]">Live</div>
          <div className="mt-0.5">{published ? "Published" : "Not public"}</div>
        </div>
        <div className="rounded-2xl bg-white px-3 py-2.5 border border-white/80">
          <div className="font-semibold text-[#2c3320]">Version</div>
          <div className="mt-0.5">{activeVersionId === "live" ? "Viewing live" : "Viewing draft"}</div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {lastSavedLabel
          ? `Last draft saved at ${lastSavedLabel}.`
          : "Changes save into drafts automatically after a short pause."}
      </p>

      <div className="mt-5 space-y-2">
        {blocks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cfd5c1] bg-white/70 px-4 py-6 text-center text-sm text-gray-500">
            Add your first block to build out the page canvas.
          </div>
        ) : (
          blocks.map((block, index) => {
            const isActive = activeBlockId === block.id;

            return (
              <button
                key={block.id}
                type="button"
                aria-label={`Jump to block ${index + 1}: ${getBlockLabel(block)}`}
                onClick={() => onJump(block.id)}
                className={`w-full rounded-2xl border px-3 py-3 text-left transition-all ${
                  isActive
                    ? "border-[#5a6e3c] bg-[#eff4ea] shadow-sm"
                    : "border-transparent bg-white/85 hover:border-[#d8dccd] hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? "bg-[#5a6e3c] text-white" : "bg-[#edf0e6] text-[#5a6e3c]"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#2c3320]">
                      {getBlockLabel(block)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {getBlockPreview(block)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#5a6e3c]">Editing Tips</div>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Use the outline to jump between sections, then publish from the toolbar when the draft is ready to go live.
        </p>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page — data fetching + orchestration
// ─────────────────────────────────────────────────────────────────────────────

export default function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [pageId, setPageId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [meta, setMeta] = useState<PageMeta>({ title: "", slug: "", description: "", published: false, showInNav: false, navLabel: "" });
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [drafts, setDrafts] = useState<DraftEntry[]>([]);
  const [liveContent, setLiveContent] = useState("[]");
  const [activeVersionId, setActiveVersionId] = useState<string>("live");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState(0);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    params.then(({ id }) => {
      setPageId(id);
      fetch(`/api/pages/${id}`)
        .then((r) => r.json())
        .then((page) => {
          setMeta({
            title: page.title ?? "",
            slug: page.slug ?? "",
            description: page.description ?? "",
            published: page.published ?? false,
            showInNav: page.showInNav ?? false,
            navLabel: page.navLabel ?? "",
          });

          // Store live (published) content and drafts list
          setLiveContent(page.content ?? "[]");
          setDrafts(page.drafts ?? []);
          setHasDraft(page.hasDraft ?? false);
          setLastSavedAt(page.drafts?.[0]?.createdAt ?? null);

          // Load latest draft if present, otherwise live content
          const latestDraft = (page.drafts ?? [])[0];
          const blocksStr = latestDraft?.content ?? page.content ?? "[]";
          setActiveVersionId(latestDraft ? latestDraft.id : "live");
          try {
            const parsed = JSON.parse(blocksStr);
            const nextBlocks = Array.isArray(parsed) ? parsed : [];
            setBlocks(nextBlocks);
            setSelectedBlockId(nextBlocks[0]?.id ?? null);
          } catch {
            setBlocks([]);
            setSelectedBlockId(null);
          }
          setDirty(false);
          setLoading(false);
        });
    });
  }, [params]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  function markDirty() {
    setDirty(true);
    setSaved(false);
  }

  function jumpToBlock(blockId: string) {
    setSelectedBlockId(blockId);
    blockRefs.current[blockId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const save = useCallback(
    async (blocksToSave?: ContentBlock[], metaToSave?: PageMeta): Promise<string | undefined> => {
      if (!pageId) return;
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = null;
      }
      setSaving(true);
      const b = blocksToSave ?? blocks;
      const m = metaToSave ?? meta;
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...m, content: b }),
      });
      if (!res.ok) {
        setSaving(false);
        return;
      }
      const updated = await res.json();
      const updatedDrafts = updated.drafts ?? [];
      setDrafts(updatedDrafts);
      setLiveContent(updated.content ?? "[]");
      setHasDraft(updatedDrafts.length > 0);
      // Point active version to the latest draft since save always creates one
      const newActiveId = updatedDrafts.length > 0 ? updatedDrafts[0].id : "live";
      setActiveVersionId(newActiveId);
      setDirty(false);
      setLastSavedAt(updatedDrafts[0]?.createdAt ?? updated.updatedAt ?? new Date().toISOString());
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return newActiveId;
    },
    [pageId, blocks, meta],
  );

  const publish = useCallback(async () => {
    if (!pageId) return;
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }
    // Save any pending draft changes first, then publish
    if (blocks.length > 0 || meta.title) {
      await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...meta, content: blocks }),
      });
    }
    setPublishing(true);
    const publishBody: Record<string, unknown> = { publish: true };
    // If editing a specific draft, publish that one
    if (activeVersionId !== "live") {
      publishBody.draftId = activeVersionId;
    }
    const res = await fetch(`/api/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publishBody),
    });
    const updated = await res.json();
    setDrafts(updated.drafts ?? []);
    setLiveContent(updated.content ?? "[]");
    setHasDraft(updated.hasDraft ?? false);
    setActiveVersionId("live");
    setDirty(false);
    setLastSavedAt(updated.updatedAt ?? new Date().toISOString());
    setPublishing(false);
    setMeta((m) => ({ ...m, published: true }));
  }, [pageId, blocks, meta, activeVersionId]);

  const unpublish = useCallback(async () => {
    if (!pageId) return;
    setPublishing(true);
    const res = await fetch(`/api/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unpublish: true }),
    });
    if (!res.ok) {
      setPublishing(false);
      return;
    }
    const updated = await res.json();
    setDrafts(updated.drafts ?? []);
    setLiveContent(updated.content ?? "[]");
    setHasDraft(updated.hasDraft ?? false);
    setMeta((m) => ({ ...m, published: false }));
    setLastSavedAt(updated.updatedAt ?? new Date().toISOString());
    setPublishing(false);
  }, [pageId]);

  // Auto-save 3 seconds after last change
  const scheduleAutoSave = useCallback(
    (b: ContentBlock[], m: PageMeta) => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => save(b, m), 3000);
    },
    [save],
  );

  function switchVersion(versionId: string, content: string) {
    // Cancel any pending auto-save from the old version
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    try {
      const parsed = JSON.parse(content);
      setBlocks(Array.isArray(parsed) ? parsed : []);
    } catch {
      setBlocks([]);
    }
    setActiveVersionId(versionId);
    setSelectedBlockId((() => {
      try {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed[0]?.id ?? null : null;
      } catch {
        return null;
      }
    })());
    setDirty(false);
    // Force remount of all block editors so EditableText picks up new content
    setCanvasKey((k) => k + 1);
    setShowHistory(false);
  }

  async function deleteDraft(draftId: string) {
    if (!pageId) return;
    const res = await fetch(`/api/pages/${pageId}/drafts/${draftId}`, { method: "DELETE" });
    if (!res.ok) return;
    const { drafts: updatedDrafts } = await res.json();
    setDrafts(updatedDrafts ?? []);
    setHasDraft((updatedDrafts ?? []).length > 0);
    // If the deleted draft was the active version, switch to the latest remaining draft or live
    if (activeVersionId === draftId) {
      if (updatedDrafts.length > 0) {
        switchVersion(updatedDrafts[0].id, updatedDrafts[0].content);
      } else {
        switchVersion("live", liveContent);
      }
    }
  }

  function updateBlock(index: number, block: ContentBlock) {
    const next = blocks.map((b, i) => (i === index ? block : b));
    setBlocks(next);
    setSelectedBlockId(block.id);
    markDirty();
    scheduleAutoSave(next, meta);
  }

  function addBlock(type: string, afterIndex: number) {
    const block = makeBlock(type);
    const next = [...blocks.slice(0, afterIndex + 1), block, ...blocks.slice(afterIndex + 1)];
    setBlocks(next);
    setSelectedBlockId(block.id);
    markDirty();
    scheduleAutoSave(next, meta);
    window.setTimeout(() => jumpToBlock(block.id), 0);
  }

  function addBlockAtTop(type: string) {
    const block = makeBlock(type);
    const next = [block, ...blocks];
    setBlocks(next);
    setSelectedBlockId(block.id);
    markDirty();
    scheduleAutoSave(next, meta);
    window.setTimeout(() => jumpToBlock(block.id), 0);
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const next = [...blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
    markDirty();
    scheduleAutoSave(next, meta);
  }

  function deleteBlock(index: number) {
    if (!confirm("Delete this block?")) return;
    const next = blocks.filter((_, i) => i !== index);
    setBlocks(next);
    setSelectedBlockId(next[Math.min(index, next.length - 1)]?.id ?? null);
    markDirty();
    scheduleAutoSave(next, meta);
  }

  function updateMeta(m: PageMeta) {
    setMeta(m);
    markDirty();
    scheduleAutoSave(blocks, m);
  }

  if (loading) {
    return (
      <div className="-mx-8 -mt-8 flex items-center justify-center h-64 bg-white">
        <p className="text-gray-400 text-sm">Loading editor…</p>
      </div>
    );
  }

  return (
    <>
      {showSettings && (
        <SettingsPanel
          meta={meta}
          onClose={() => setShowSettings(false)}
          onChange={updateMeta}
          onSave={() => save(blocks, meta)}
          saving={saving}
        />
      )}

      {showHistory && (
        <VersionHistoryPanel
          drafts={drafts}
          liveContent={liveContent}
          activeVersionId={activeVersionId}
          published={meta.published}
          onSwitch={switchVersion}
          onDelete={deleteDraft}
          onClose={() => setShowHistory(false)}
        />
      )}

      <div className="-mx-8 -mt-8 min-h-screen flex flex-col bg-gray-50">
        {/* ── Editor toolbar ── */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 shadow-sm">
          <Link href="/admin/pages" className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1">
            ← Pages
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex-1 min-w-0">
            <input
              className="font-semibold text-[#2c3320] text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5a6e3c]/30 rounded px-1 w-full max-w-xs"
              value={meta.title}
              onChange={(e) => updateMeta({ ...meta, title: e.target.value })}
              placeholder="Page title"
            />
            <p className="mt-1 text-[11px] text-gray-400 truncate">
              {meta.slug.startsWith("_") ? `System page: ${meta.slug}` : `/${meta.slug || "untitled"}`}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${meta.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
              {meta.published ? "Published" : "Draft only"}
            </span>
            {hasDraft && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${activeVersionId === "live" && !dirty ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
                {activeVersionId === "live" && !dirty ? "Viewing live" : "Working draft"}
              </span>
            )}
            {dirty ? (
              <span className="text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                Autosave pending
              </span>
            ) : (
              lastSavedAt && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  Saved {formatSavedTime(lastSavedAt)}
                </span>
              )
            )}
          </div>
          <button onClick={() => setShowSettings(true)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            ⚙ Settings
          </button>
          <button onClick={() => setShowHistory(true)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            ↻ History
          </button>
          {pageId && (
            <button
              onClick={async () => {
                let previewVersion = activeVersionId;
                if (dirty || activeVersionId !== "live") {
                  const savedId = await save(blocks, meta);
                  if (savedId) previewVersion = savedId;
                }
                window.open(`/admin/preview/${pageId}?draftId=${previewVersion}`, "_blank", "noopener,noreferrer");
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Preview ↗
            </button>
          )}
          {meta.published && (
            <button
              onClick={unpublish}
              disabled={publishing}
              className="border border-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {publishing ? "Updating…" : "Unpublish"}
            </button>
          )}
          {(hasDraft || !meta.published) && (
            <button
              onClick={publish}
              disabled={publishing}
              className="bg-[#7a9960] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#5a6e3c] transition-colors disabled:opacity-50"
            >
              {publishing ? "Publishing…" : meta.published ? "Publish Changes" : "Publish Page"}
            </button>
          )}
          <button
            onClick={() => save()}
            disabled={saving}
            className="bg-[#5a6e3c] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#4a5e32] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Draft"}
          </button>
        </div>

        <div className="flex-1 xl:grid xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* ── Block canvas ── */}
          <div key={canvasKey} className="bg-white xl:border-r xl:border-gray-200">
            <div className="px-6 pt-6">
              <div className="rounded-[28px] border border-[#e4e7dc] bg-[#faf8f3] px-5 py-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a6e3c]">Page Builder</p>
                    <h2 className="mt-2 font-(family-name:--font-playfair) text-2xl font-bold text-[#2c3320]">
                      Build and review in one place
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                      Draft edits autosave in the background. Use History to inspect older drafts, then publish when you are ready to update the live page.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 font-medium text-gray-600 border border-white/80">
                      {blocks.length} block{blocks.length === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 font-medium text-gray-600 border border-white/80">
                      {hasDraft ? `${drafts.length} saved draft${drafts.length === 1 ? "" : "s"}` : "No draft history yet"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 font-medium text-gray-600 border border-white/80">
                      {selectedBlockId ? "Block selected" : "Select a block to focus it"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add block at top */}
            <div className="px-6 pt-4">
              <AddBlockButton onAdd={addBlockAtTop} />
            </div>

            {blocks.length === 0 && (
              <div className="py-24 text-center text-gray-400">
                <p className="text-lg mb-2">Your page is empty</p>
                <p className="text-sm">Use the &ldquo;+ Add Block&rdquo; button above to start building</p>
              </div>
            )}

            {blocks.map((block, index) => (
              <div key={block.id}>
                <BlockWrapper
                  block={block}
                  index={index}
                  total={blocks.length}
                  selected={selectedBlockId === block.id}
                  onSelect={() => setSelectedBlockId(block.id)}
                  blockRef={(node) => {
                    blockRefs.current[block.id] = node;
                  }}
                  onMoveUp={() => moveBlock(index, -1)}
                  onMoveDown={() => moveBlock(index, 1)}
                  onDelete={() => deleteBlock(index)}
                >
                  <BlockEditor block={block} onChange={(b) => updateBlock(index, b)} />
                </BlockWrapper>
                <div className="px-6">
                  <AddBlockButton onAdd={(type) => addBlock(type, index)} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden xl:block bg-[#f5f3eb]">
            <div className="sticky top-18.25 p-5">
              <BlockOutline
                blocks={blocks}
                activeBlockId={selectedBlockId}
                published={meta.published}
                hasDraft={hasDraft}
                activeVersionId={activeVersionId}
                dirty={dirty}
                saving={saving}
                lastSavedAt={lastSavedAt}
                onJump={jumpToBlock}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
