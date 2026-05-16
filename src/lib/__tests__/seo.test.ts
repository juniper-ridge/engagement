import { describe, expect, it } from "vitest";
import {
  adminMetadata,
  getHomePageJsonLd,
  homeMetadata,
  SITE_URL,
} from "@/lib/seo";

describe("seo config", () => {
  it("marks admin routes as non-indexable", () => {
    expect(adminMetadata.robots).toMatchObject({
      index: false,
      follow: false,
      noarchive: true,
      nocache: true,
      nosnippet: true,
    });
  });

  it("defines strong homepage metadata", () => {
    expect(homeMetadata.alternates?.canonical).toBe("/");
    expect(homeMetadata.description).toContain("Wasatch Front");
    expect(homeMetadata.keywords).toContain("utah landscape design");
    expect(homeMetadata.openGraph).toMatchObject({
      title: "Landscape Design and Outdoor Living in Utah",
      url: "/",
      type: "website",
    });
  });

  it("publishes structured data for the homepage", () => {
    const jsonLd = getHomePageJsonLd();
    const graph = jsonLd["@graph"];

    expect(graph).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "WebPage",
          url: SITE_URL,
        }),
        expect.objectContaining({
          "@type": "Service",
          serviceType: "Landscape design",
        }),
      ]),
    );
  });
});