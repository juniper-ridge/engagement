import { getHomePageJsonLd, homeMetadata } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlocksView } from "@/components/cms/BlocksView";
import { prisma } from "@/lib/prisma";
import type { ContentBlock } from "@/components/cms/types";

export const metadata = homeMetadata;

export const revalidate = 60;

export default async function HomePage() {
  let blocks: ContentBlock[] = [];
  try {
    const page = await prisma.page.findUnique({ where: { slug: "_home" } });
    if (page?.published) blocks = JSON.parse(page.content) as ContentBlock[];
  } catch {
    // DB not ready — render empty
  }

  const homePageJsonLd = getHomePageJsonLd();

  return (
    <>
      <Navbar />
      <main id="main-content" className="site-main">
        <BlocksView blocks={blocks} />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
    </>
  );
}
