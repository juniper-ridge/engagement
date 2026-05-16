import type { Metadata, MetadataRoute } from "next";

export const SITE_URL = "https://juniperridgelandscape.com";
export const SITE_NAME = "Juniper Ridge Landscape";
export const DEFAULT_OG_IMAGE = "/logo.webp";

const HOME_TITLE = "Landscape Design and Outdoor Living in Utah";
const HOME_DESCRIPTION =
  "Custom landscape design, planting plans, hardscaping, and outdoor living spaces for homeowners across the Wasatch Front, Utah.";

export const homeMetadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "utah landscape design",
    "wasatch front landscaping",
    "hardscape design utah",
    "outdoor living design",
    "planting plans",
    "residential landscape designer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export const adminMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
    nosnippet: true,
  },
};

export function getRobotsConfig(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

export function getHomePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${HOME_TITLE} | ${SITE_NAME}`,
        description: HOME_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#business` },
      },
      {
        "@type": "Service",
        serviceType: "Landscape design",
        provider: { "@id": `${SITE_URL}/#business` },
        areaServed: "Wasatch Front, Utah",
      },
      {
        "@type": "Service",
        serviceType: "Hardscape design",
        provider: { "@id": `${SITE_URL}/#business` },
        areaServed: "Wasatch Front, Utah",
      },
      {
        "@type": "Service",
        serviceType: "Outdoor living spaces",
        provider: { "@id": `${SITE_URL}/#business` },
        areaServed: "Wasatch Front, Utah",
      },
    ],
  };
}