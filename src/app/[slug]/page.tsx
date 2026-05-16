import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlocksView } from "@/components/cms/BlocksView";
import type { ContentBlock } from "@/components/cms/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || !page.published) return {};
  return {
    title: page.title,
    description: page.description ?? undefined,
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page || !page.published) notFound();

  let blocks: ContentBlock[] = [];
  try {
    blocks = JSON.parse(page.content) as ContentBlock[];
  } catch {
    // empty page content
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="site-main">
        {blocks.length > 0 ? (
          <BlocksView blocks={blocks} />
        ) : (
          <div className="page-empty">
            <div className="page-empty__panel">
              <h1 className="page-empty__title">{page.title}</h1>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
