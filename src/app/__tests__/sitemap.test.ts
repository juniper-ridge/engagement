import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyPages, findManyPosts } = vi.hoisted(() => ({
  findManyPages: vi.fn(),
  findManyPosts: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: { findMany: findManyPages },
    post: { findMany: findManyPosts },
  },
}));

import sitemap from "../sitemap";
import { SITE_URL } from "@/lib/seo";

describe("sitemap route", () => {
  beforeEach(() => {
    findManyPages.mockReset();
    findManyPosts.mockReset();
  });

  it("includes public pages and published blog posts", async () => {
    findManyPages.mockResolvedValueOnce([
      { slug: "services", updatedAt: new Date("2026-05-01T00:00:00.000Z") },
      { slug: "_home", updatedAt: new Date("2026-05-01T00:00:00.000Z") },
    ]);
    findManyPosts.mockResolvedValueOnce([
      {
        slug: "spring-landscape-tips",
        updatedAt: new Date("2026-05-02T00:00:00.000Z"),
      },
    ]);

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/services`);
    expect(urls).toContain(`${SITE_URL}/blog/spring-landscape-tips`);
    expect(urls).not.toContain(`${SITE_URL}/_home`);
  });

  it("falls back to static routes when the database is unavailable", async () => {
    findManyPages.mockRejectedValueOnce(new Error("db down"));
    findManyPosts.mockRejectedValueOnce(new Error("db down"));

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        SITE_URL,
        `${SITE_URL}/about`,
        `${SITE_URL}/contact`,
        `${SITE_URL}/blog`,
      ]),
    );
  });
});