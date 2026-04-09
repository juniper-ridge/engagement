import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import type { NextRequest } from "next/server";

const mockAuth = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  heroSlide: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

function makeReq(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

const mockSession = { user: { id: "user-1", email: "admin@test.com", name: "Admin" } };

describe("GET /api/hero-slides", () => {
  beforeEach(() => {
    mockPrisma.heroSlide.findMany.mockReset();
  });

  it("returns active slides ordered by order field", async () => {
    const fakeSlides = [
      { id: "slide-1", title: "Slide 1", imageUrl: "https://example.com/1.jpg", order: 0, active: true },
      { id: "slide-2", title: "Slide 2", imageUrl: "https://example.com/2.jpg", order: 1, active: true },
    ];
    mockPrisma.heroSlide.findMany.mockResolvedValueOnce(fakeSlides);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(fakeSlides);
    expect(mockPrisma.heroSlide.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { active: true },
        orderBy: { order: "asc" },
      })
    );
  });

  it("returns empty array when no active slides exist", async () => {
    mockPrisma.heroSlide.findMany.mockResolvedValueOnce([]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });
});

describe("POST /api/hero-slides", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockPrisma.heroSlide.create.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await POST(
      makeReq({ title: "New Slide", imageUrl: "https://example.com/img.jpg" })
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 on invalid schema (missing required imageUrl)", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const res = await POST(makeReq({ title: "New Slide" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when imageUrl is not a valid URL", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const res = await POST(makeReq({ title: "New Slide", imageUrl: "not-a-url" }));
    expect(res.status).toBe(400);
  });

  it("returns 201 with created slide on success", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const newSlide = {
      id: "slide-new",
      title: "Summer Promo",
      imageUrl: "https://example.com/summer.jpg",
      order: 0,
      active: true,
    };
    mockPrisma.heroSlide.create.mockResolvedValueOnce(newSlide);
    const res = await POST(
      makeReq({ title: "Summer Promo", imageUrl: "https://example.com/summer.jpg" })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(newSlide);
  });
});
