import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const RESERVED = ["about", "blog", "contact", "admin", "api", "services"];

export async function GET(request: Request) {
  const nav = new URL(request.url).searchParams.get("nav") === "true";

  if (nav) {
    // Public — only published nav pages + whether blog posts exist
    const [pages, postCount] = await Promise.all([
      prisma.page.findMany({
        where: { published: true, showInNav: true },
        select: { slug: true, navLabel: true, title: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.post.count({ where: { published: true } }),
    ]);
    return NextResponse.json({ pages, hasPosts: postCount > 0 });
  }

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      published: true,
      showInNav: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { slug, title, description, content, published, showInNav, navLabel } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
      { status: 400 },
    );
  }
  if (RESERVED.includes(slug)) {
    return NextResponse.json(
      { error: `"/${slug}" is a reserved path and cannot be used` },
      { status: 400 },
    );
  }

  try {
    const page = await prisma.page.create({
      data: {
        slug,
        title,
        description: description ?? null,
        content: JSON.stringify(content ?? []),
        published: published ?? false,
        showInNav: showInNav ?? false,
        navLabel: navLabel ?? null,
      },
    });
    return NextResponse.json(page, { status: 201 });
  } catch {
    return NextResponse.json({ error: "A page with that slug already exists" }, { status: 409 });
  }
}
