import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../route";
import type { NextRequest } from "next/server";

// Use vi.hoisted so these refs are available inside the hoisted vi.mock factory
const emailMocks = vi.hoisted(() => ({
  isEmailConfigured: false,
  sendContactEmail: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  get isEmailConfigured() {
    return emailMocks.isEmailConfigured;
  },
  sendContactEmail: emailMocks.sendContactEmail,
}));

function makeReq(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    emailMocks.isEmailConfigured = false;
    emailMocks.sendContactEmail.mockReset();
  });

  it("returns 503 when email is not configured", async () => {
    const res = await POST(makeReq({ name: "Test", email: "t@t.com", message: "hi" }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/unavailable/i);
  });

  it("returns 400 on invalid body (Zod validation failure)", async () => {
    emailMocks.isEmailConfigured = true;
    const res = await POST(makeReq({ name: "", email: "not-an-email", message: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid/i);
  });

  it("returns 400 when required fields are missing", async () => {
    emailMocks.isEmailConfigured = true;
    const res = await POST(makeReq({ email: "test@example.com" }));
    expect(res.status).toBe(400);
  });

  it("returns 200 and calls sendContactEmail on success", async () => {
    emailMocks.isEmailConfigured = true;
    emailMocks.sendContactEmail.mockResolvedValueOnce(undefined);
    const res = await POST(
      makeReq({ name: "Test User", email: "test@example.com", message: "Hello there" })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true });
    expect(emailMocks.sendContactEmail).toHaveBeenCalledOnce();
    expect(emailMocks.sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Test User", email: "test@example.com" })
    );
  });

  it("returns 200 when optional phone field is omitted", async () => {
    emailMocks.isEmailConfigured = true;
    emailMocks.sendContactEmail.mockResolvedValueOnce(undefined);
    const res = await POST(
      makeReq({ name: "Test", email: "test@example.com", message: "No phone here" })
    );
    expect(res.status).toBe(200);
  });

  it("returns 500 when sendContactEmail throws", async () => {
    emailMocks.isEmailConfigured = true;
    emailMocks.sendContactEmail.mockRejectedValueOnce(new Error("SMTP failure"));
    const res = await POST(
      makeReq({ name: "Test User", email: "test@example.com", message: "Hello" })
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/failed/i);
  });
});
