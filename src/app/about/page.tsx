import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlocksView } from "@/components/cms/BlocksView";
import { prisma } from "@/lib/prisma";
import type { ContentBlock } from "@/components/cms/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: "_about" } });
  return {
    title: "About",
    description:
      page?.description ??
      "Learn about Juniper Ridge Landscape — a sole-practitioner landscape and hardscape design studio serving the Wasatch Front, Utah.",
  };
}

export default async function AboutPage() {
  let blocks: ContentBlock[] = [];
  try {
    const page = await prisma.page.findUnique({ where: { slug: "_about" } });
    if (page?.published) blocks = JSON.parse(page.content) as ContentBlock[];
  } catch {
    // DB not ready
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="site-main">
        <BlocksView blocks={blocks} />
      </main>
      <Footer />
    </>
  );
}


