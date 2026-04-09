import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail, isEmailConfigured } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().default(""),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  if (!isEmailConfigured) {
    return NextResponse.json(
      { error: "The contact form is currently unavailable. Please reach us by phone or email directly." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await sendContactEmail(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data.", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
