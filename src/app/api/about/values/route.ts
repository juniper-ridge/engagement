import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const ICON_KEYS = ["sustainability", "craftsmanship", "collaboration", "innovation", "heart", "leaf"] as const;

const schema = z.object({
  iconKey: z.enum(ICON_KEYS).optional().default("sustainability"),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

// GET: public — returns all active values in order
export async function GET() {
  const values = await prisma.aboutValue.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(values);
}

// POST: admin only — create a value
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = schema.parse(body);
    const value = await prisma.aboutValue.create({ data });
    return NextResponse.json(value, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
