"use client";

import { useState } from "react";

export function PreviewToast({
  pageTitle,
  hasDraft,
  editorHref,
  liveHref,
}: {
  pageTitle: string;
  hasDraft: boolean;
  editorHref: string;
  liveHref?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 z-60 flex items-center gap-2 rounded-full bg-[#2c3320] px-4 py-2 text-xs font-semibold text-white shadow-2xl ring-1 ring-white/10 hover:bg-[#3a4428] transition-colors"
        aria-label="Expand preview toast"
      >
        <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Draft Preview
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-60 w-72 rounded-xl bg-[#2c3320] text-white shadow-2xl ring-1 ring-white/10">
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-0.5">
            Draft Preview
          </p>
          <p className="text-sm font-medium text-white truncate">{pageTitle}</p>
          <p className={`text-xs mt-0.5 ${hasDraft ? "text-amber-300 font-medium" : "text-white/50"}`}>
            {hasDraft ? "Unpublished changes" : "No unpublished changes"}
          </p>
        </div>
        <div className="ml-1 flex shrink-0 items-center gap-1">
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/40 hover:text-white/80 transition-colors"
            aria-label="Collapse"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5">
        <a
          href={editorHref}
          className="flex-1 text-center rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"
        >
          ← Back to Editor
        </a>
        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            className="flex-1 text-center rounded-lg bg-[#5a6e3c] px-3 py-1.5 text-xs font-semibold hover:bg-[#7a9960] transition-colors"
          >
            View Live ↗
          </a>
        )}
      </div>
    </div>
  );
}
