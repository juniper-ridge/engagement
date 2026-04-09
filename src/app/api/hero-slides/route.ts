import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().or(z.literal("")),
  imageUrl: z.string().url(),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

// GET: public — returns active slides in order
export async function GET() {
  const slides = await prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(slides);
}

// POST: admin only — create a new slide
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = schema.parse(body);
    const slide = await prisma.heroSlide.create({ data });
    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
