import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  bio: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
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
    const member = await prisma.aboutTeamMember.update({ where: { id }, data });
    return NextResponse.json(member);
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
  await prisma.aboutTeamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
