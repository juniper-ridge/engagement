import { describe, expect, it } from "vitest";
import robots from "../robots";
import { SITE_URL } from "@/lib/seo";

describe("robots route", () => {
  it("disallows crawling the admin area", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
    });
  });
});