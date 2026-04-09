import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  heroTagline: z.string().min(1).max(100).optional(),
  heroTitle1: z.string().min(1).max(200).optional(),
  heroTitle2: z.string().min(1).max(200).optional(),
  heroSubtitle: z.string().min(1).max(500).optional(),
  heroImageUrl: z.string().url().optional(),
  storyImageUrl: z.string().url().optional(),
  storyHeading: z.string().min(1).max(200).optional(),
  storyParagraph1: z.string().min(1).optional(),
  storyParagraph2: z.string().min(1).optional(),
  storyParagraph3: z.string().min(1).optional(),
  teamSectionLabel: z.string().min(1).max(100).optional(),
  teamSectionTitle: z.string().min(1).max(200).optional(),
  teamSectionSubtitle: z.string().min(1).max(300).optional(),
});

// GET: public — returns the singleton settings record (or null)
export async function GET() {
  const settings = await prisma.aboutPageSettings.findFirst();
  return NextResponse.json(settings);
}

// PUT: admin only — upsert the singleton settings record
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.aboutPageSettings.findFirst();
    const settings = existing
      ? await prisma.aboutPageSettings.update({ where: { id: existing.id }, data })
      : await prisma.aboutPageSettings.create({ data });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
