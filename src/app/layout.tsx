import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Juniper Ridge Landscape",
  },
  description:
    "Juniper Ridge Landscape creates beautiful, sustainable outdoor spaces tailored to your vision.",
  keywords: [
    "landscape design",
    "garden design",
    "hardscaping",
    "outdoor living",
  ],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_NAME,
    description:
      "Juniper Ridge Landscape creates beautiful, sustainable outdoor spaces tailored to your vision.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="site-body">
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LandscapingBusiness",
              "@id": `${SITE_URL}/#business`,
              name: SITE_NAME,
              description: "Landscape and hardscape design studio serving the Wasatch Front, Utah.",
              url: SITE_URL,
              email: "info@juniperridgelandscape.com",
              telephone: "+15558675309",
              areaServed: "Wasatch Front, Utah",
              openingHours: "Mo-Fr 09:00-17:00",
            }),
          }}
        />
      </body>
    </html>
  );
}
