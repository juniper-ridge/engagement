import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(200),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

// GET: public — returns all active services in order
export async function GET() {
  const services = await prisma.aboutService.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(services);
}

// POST: admin only — create a service
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = schema.parse(body);
    const service = await prisma.aboutService.create({ data });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data.", details: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
