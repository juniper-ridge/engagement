import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Toggle a like. Uses IP as identifier (no login required for visitors).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postId = body.postId as string;
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id: postId, published: true } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Get a stable identifier — use IP or a fallback
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "0.0.0.0";

    const existing = await prisma.like.findUnique({
      where: { postId_ipAddress: { postId, ipAddress: ip } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      const count = await prisma.like.count({ where: { postId } });
      return NextResponse.json({ liked: false, count });
    } else {
      await prisma.like.create({ data: { postId, ipAddress: ip } });
      const count = await prisma.like.count({ where: { postId } });
      return NextResponse.json({ liked: true, count });
    }
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
