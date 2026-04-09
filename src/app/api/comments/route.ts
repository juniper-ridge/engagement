import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  postId: z.string().min(1),
  authorName: z.string().min(1).max(200),
  email: z.string().email().max(200),
  content: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const post = await prisma.post.findUnique({
      where: { id: data.postId, published: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: data.postId,
        authorName: data.authorName,
        email: data.email,
        content: data.content,
        approved: false,
      },
    });

    return NextResponse.json({ success: true, id: comment.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data." }, { status: 400 });
    }
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
