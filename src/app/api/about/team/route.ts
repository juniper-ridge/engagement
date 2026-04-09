import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  bio: z.string().min(1),
  imageUrl: z.string().url(),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

// GET: public — returns all active team members in order
export async function GET() {
  const members = await prisma.aboutTeamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(members);
}

// POST: admin only — create a team member
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = schema.parse(body);
    const member = await prisma.aboutTeamMember.create({ data });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
