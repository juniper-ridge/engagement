import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../route";
import type { NextRequest } from "next/server";

const mockPrisma = vi.hoisted(() => ({
  post: {
    findUnique: vi.fn(),
  },
  comment: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

function makeReq(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

const validBody = {
  postId: "post-abc",
  authorName: "Jane Doe",
  email: "jane@example.com",
  content: "Great post!",
};

describe("POST /api/comments", () => {
  beforeEach(() => {
    mockPrisma.post.findUnique.mockReset();
    mockPrisma.comment.create.mockReset();
  });

  it("returns 400 on invalid body (empty required fields)", async () => {
    const res = await POST(makeReq({ postId: "", authorName: "", email: "bad", content: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid/i);
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeReq({ postId: "p1", authorName: "Jane", content: "Hi" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when the post does not exist or is not published", async () => {
    mockPrisma.post.findUnique.mockResolvedValueOnce(null);
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/not found/i);
  });

  it("queries for a published post with the given postId", async () => {
    mockPrisma.post.findUnique.mockResolvedValueOnce(null);
    await POST(makeReq(validBody));
    expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
      where: { id: "post-abc", published: true },
    });
  });

  it("returns 201 with comment id on success", async () => {
    mockPrisma.post.findUnique.mockResolvedValueOnce({ id: "post-abc" });
    mockPrisma.comment.create.mockResolvedValueOnce({ id: "comment-1", ...validBody, approved: false });
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ success: true, id: "comment-1" });
    expect(mockPrisma.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ postId: "post-abc", approved: false }),
      })
    );
  });
});
