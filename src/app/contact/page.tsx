import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlocksView } from "@/components/cms/BlocksView";
import { prisma } from "@/lib/prisma";
import type { ContentBlock } from "@/components/cms/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: "_contact" } });
  return {
    title: "Contact",
    description:
      page?.description ??
      "Get in touch with Juniper Ridge Landscape to schedule a design consultation. Serving the Wasatch Front, Utah.",
  };
}

export default async function ContactPage() {
  let blocks: ContentBlock[] = [];
  try {
    const page = await prisma.page.findUnique({ where: { slug: "_contact" } });
    if (page?.published) blocks = JSON.parse(page.content) as ContentBlock[];
  } catch {
    // DB not ready
  }

  const bookingsUrl = process.env.NEXT_PUBLIC_BOOKINGS_URL || "";

  return (
    <>
      <Navbar />
      <main id="main-content" className="site-main">
        <BlocksView blocks={blocks} />

        <section className="section section--white">
          <div className="bookings-shell">
            <div className="section-intro">
              <span className="eyebrow">
                Online Booking
              </span>
              <h2 className="section-heading">
                Schedule a Consultation
              </h2>
              <p className="section-subtitle">
                Schedule a free 30-minute consultation with our design team
                using our online booking system. Pick a time that works for you.
              </p>
            </div>

            {bookingsUrl ? (
              <div className="bookings-frame">
                <iframe
                  src={bookingsUrl}
                  width="100%"
                  height="100%"
                  scrolling="yes"
                  title="Schedule a consultation with Juniper Ridge Landscape"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                />
              </div>
            ) : (
              <div className="bookings-placeholder page-empty__panel">
                <p className="placeholder-card__title">Microsoft Bookings</p>
                <p className="placeholder-card__text">
                  Set{" "}
                  <code className="inline-code">
                    NEXT_PUBLIC_BOOKINGS_URL
                  </code>{" "}
                  in your{" "}
                  <code className="inline-code">.env</code>{" "}
                  to your Microsoft Bookings page URL.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

