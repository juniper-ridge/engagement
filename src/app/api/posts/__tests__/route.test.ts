import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import type { NextRequest } from "next/server";

const mockAuth = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  post: {
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

describe("GET /api/posts", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockPrisma.post.findMany.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await GET({} as NextRequest);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns posts list when authenticated", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const fakePosts = [
      { id: "p1", title: "Post 1", slug: "post-1", _count: { comments: 0, likes: 0 } },
    ];
    mockPrisma.post.findMany.mockResolvedValueOnce(fakePosts);
    const res = await GET({} as NextRequest);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(fakePosts);
    expect(mockPrisma.post.findMany).toHaveBeenCalledOnce();
  });
});

describe("POST /api/posts", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockPrisma.post.create.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await POST(makeReq({ title: "Test", slug: "test", content: "c", excerpt: "e" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid schema (bad slug format)", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const res = await POST(
      makeReq({ title: "Test", slug: "Invalid Slug!", content: "c", excerpt: "e" })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid/i);
  });

  it("returns 400 when required fields are missing", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const res = await POST(makeReq({ title: "Only title" }));
    expect(res.status).toBe(400);
  });

  it("returns 201 with created post on success", async () => {
    mockAuth.mockResolvedValueOnce(mockSession);
    const fakePost = {
      id: "new-post-1",
      title: "My Post",
      slug: "my-post",
      content: "Content here",
      excerpt: "A short excerpt",
      published: false,
      tags: "",
    };
    mockPrisma.post.create.mockResolvedValueOnce(fakePost);
    const res = await POST(
      makeReq({ title: "My Post", slug: "my-post", content: "Content here", excerpt: "A short excerpt" })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(fakePost);
    expect(mockPrisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: "My Post", slug: "my-post", authorId: "user-1" }),
      })
    );
  });
});
