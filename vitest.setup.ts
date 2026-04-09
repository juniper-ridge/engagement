import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// ── Next.js navigation ─────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// ── next/image — renders a plain <img> so layout tests work ───────────────
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    [k: string]: unknown;
  }) => React.createElement("img", { src, alt, ...rest }),
}));

// ── next/link — renders a plain <a> ───────────────────────────────────────
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [k: string]: unknown;
  }) => React.createElement("a", { href, ...rest }, children),
}));

// ── next-intl ─────────────────────────────────────────────────────────────
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
  getTranslations: async () => (key: string) => key,
}));

vi.mock("next-intl/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [k: string]: unknown;
  }) => React.createElement("a", { href, ...rest }, children),
}));

// ── NextAuth ──────────────────────────────────────────────────────────────
vi.mock("next-auth/react", () => ({
  signIn: vi.fn().mockResolvedValue({ ok: true }),
  signOut: vi.fn().mockResolvedValue(undefined),
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => children,
}));
