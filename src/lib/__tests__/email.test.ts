import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// nodemailer is mocked so no real SMTP connections are made in tests
const mockSendMail = vi.fn();
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
  },
}));

describe("isEmailConfigured", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    // Restore env and clear module cache so isEmailConfigured re-evaluates
    Object.assign(process.env, originalEnv);
    // Remove new keys that weren't originally set
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    vi.resetModules();
  });

  it("is false when SMTP env vars are missing", async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.CLIENT_EMAIL;
    const { isEmailConfigured } = await import("@/lib/email");
    expect(isEmailConfigured).toBe(false);
  });

  it("is false when only some SMTP vars are set", async () => {
    process.env.SMTP_HOST = "smtp.example.com";
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.CLIENT_EMAIL;
    const { isEmailConfigured } = await import("@/lib/email");
    expect(isEmailConfigured).toBe(false);
  });

  it("is true when all required SMTP vars are set", async () => {
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_USER = "user@example.com";
    process.env.SMTP_PASS = "secret";
    process.env.CLIENT_EMAIL = "client@example.com";
    const { isEmailConfigured } = await import("@/lib/email");
    expect(isEmailConfigured).toBe(true);
  });
});

describe("sendContactEmail", () => {
  beforeEach(() => {
    mockSendMail.mockReset();
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "user@example.com";
    process.env.SMTP_PASS = "secret";
    process.env.SMTP_FROM = "noreply@example.com";
    process.env.CLIENT_EMAIL = "client@example.com";
    process.env.NEXT_PUBLIC_SITE_NAME = "Juniper Ridge Landscape";
    process.env.NEXT_PUBLIC_DOMAIN = "juniperridgelandscape.com";
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("calls sendMail with correct to/replyTo/subject", async () => {
    mockSendMail.mockResolvedValueOnce({});
    const { sendContactEmail } = await import("@/lib/email");
    await sendContactEmail({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "555-1234",
      message: "Hello!",
    });
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "client@example.com",
        replyTo: "jane@example.com",
        subject: expect.stringContaining("Jane Doe"),
        html: expect.stringContaining("Jane Doe"),
      })
    );
  });

  it("includes the submitter's message in the email body", async () => {
    mockSendMail.mockResolvedValueOnce({});
    const { sendContactEmail } = await import("@/lib/email");
    await sendContactEmail({
      name: "Jane",
      email: "jane@example.com",
      phone: "",
      message: "I need a garden bed installed",
    });
    const callArgs = mockSendMail.mock.calls[0][0];
    expect(callArgs.html).toContain("I need a garden bed installed");
  });

  it("throws when SMTP is not configured", async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.CLIENT_EMAIL;
    const { sendContactEmail } = await import("@/lib/email");
    await expect(
      sendContactEmail({ name: "Jane", email: "j@j.com", phone: "", message: "Hi" })
    ).rejects.toThrow(/not configured/i);
  });
});
