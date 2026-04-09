import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(300),
  slug: z
    .string()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional().default(false),
  tags: z.string().optional().default(""),
});

// GET: list all posts (admin sees all, public blog uses the /blog route)
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true, likes: true } } },
  });
  return NextResponse.json(posts);
}

// POST: create a new post
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: (session.user as any).id,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
