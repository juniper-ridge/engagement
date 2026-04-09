import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const ICON_KEYS = ["sustainability", "craftsmanship", "collaboration", "innovation", "heart", "leaf"] as const;

const schema = z.object({
  iconKey: z.enum(ICON_KEYS).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const value = await prisma.aboutValue.update({ where: { id }, data });
    return NextResponse.json(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.aboutValue.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
