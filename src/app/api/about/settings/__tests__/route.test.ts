import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PUT } from "../route";
import type { NextRequest } from "next/server";

const mockAuth = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  aboutPageSettings: {
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

function makeReq(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

const mockSession = { user: { id: "user-1", email: "admin@test.com", name: "Admin" } };

describe("GET /api/about/settings", () => {
  beforeEach(() => {
    mockPrisma.aboutPageSettings.findFirst.mockReset();
  });

  it("returns null when no settings exist", async () => {
    mockPrisma.aboutPageSettings.findFirst.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBeNull();
  });

  it("returns the settings record when it exists", async () => {
    const fakeSettings = {
      id: "settings-1",
      heroTagline: "We build beautiful landscapes",
      heroTitle1: "Juniper Ridge",
    };
    mockPrisma.aboutPageSettings.findFirst.mockResolvedValueOnce(fakeSettings);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(fakeSettings);
  });
});

describe("PUT /api/about/settings", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockPrisma.aboutPageSettings.findFirst.mockReset();
    mockPrisma.aboutPageSettings.update.mockReset();
    mockPrisma.aboutPageSettings.create.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await PUT(makeReq({ heroTagline: "New tagline" }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("creates settings when none exist (first-time upsert)", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    mockPrisma.aboutPageSettings.findFirst.mockResolvedValueOnce(null);
    const newSettings = { id: "settings-new", heroTagline: "New tagline" };
    mockPrisma.aboutPageSettings.create.mockResolvedValueOnce(newSettings);
    const res = await PUT(makeReq({ heroTagline: "New tagline" }));
    expect(res.status).toBe(200);
    expect(mockPrisma.aboutPageSettings.create).toHaveBeenCalledOnce();
    expect(mockPrisma.aboutPageSettings.update).not.toHaveBeenCalled();
  });

  it("updates settings when a record already exists", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const existing = { id: "settings-1", heroTagline: "Old tagline" };
    mockPrisma.aboutPageSettings.findFirst.mockResolvedValueOnce(existing);
    const updated = { ...existing, heroTagline: "Updated tagline" };
    mockPrisma.aboutPageSettings.update.mockResolvedValueOnce(updated);
    const res = await PUT(makeReq({ heroTagline: "Updated tagline" }));
    expect(res.status).toBe(200);
    expect(mockPrisma.aboutPageSettings.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "settings-1" } })
    );
    expect(mockPrisma.aboutPageSettings.create).not.toHaveBeenCalled();
  });

  it("returns 400 on Zod validation failure", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    // heroTagline exceeds max length of 100
    const res = await PUT(makeReq({ heroTagline: "x".repeat(101) }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid/i);
  });
});
