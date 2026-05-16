import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PageEditorPage from "../page";

type MockPageResponse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  showInNav: boolean;
  navLabel: string;
  content: string;
  drafts: Array<{ id: string; content: string; createdAt: string }>;
  hasDraft: boolean;
  updatedAt: string;
};

const scrollIntoViewMock = vi.fn();
const openMock = vi.fn();

const pageWithBlocks: MockPageResponse = {
  id: "page-1",
  title: "Services",
  slug: "services",
  description: "Landscape services page",
  published: true,
  showInNav: true,
  navLabel: "Services",
  content: JSON.stringify([
    {
      id: "block-1",
      type: "heading",
      level: 2,
      text: "Design Services",
      accent: "Services",
      centered: false,
    },
    {
      id: "block-2",
      type: "paragraph",
      text: "Custom planting plans and outdoor rooms.",
      centered: false,
    },
  ]),
  drafts: [
    {
      id: "draft-existing",
      content: JSON.stringify([
        {
          id: "block-1",
          type: "heading",
          level: 2,
          text: "Design Services",
          accent: "Services",
          centered: false,
        },
      ]),
      createdAt: "2026-05-12T15:04:00.000Z",
    },
  ],
  hasDraft: true,
  updatedAt: "2026-05-12T15:04:00.000Z",
};

const emptyPage: MockPageResponse = {
  id: "page-1",
  title: "New Page",
  slug: "new-page",
  description: "Fresh page",
  published: true,
  showInNav: false,
  navLabel: "",
  content: "[]",
  drafts: [],
  hasDraft: false,
  updatedAt: "2026-05-12T16:00:00.000Z",
};

function jsonResponse(data: unknown, ok = true) {
  return {
    ok,
    json: async () => data,
  } as Response;
}

function mockFetchForEditor(initialPage: MockPageResponse, patchPage?: MockPageResponse) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";

    if (url === "/api/pages/page-1" && method === "GET") {
      return jsonResponse(initialPage);
    }

    if (url === "/api/pages/page-1" && method === "PATCH") {
      return jsonResponse(patchPage ?? initialPage);
    }

    throw new Error(`Unexpected fetch: ${method} ${url}`);
  });
}

describe("PageEditorPage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "open", {
      writable: true,
      value: openMock,
    });
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoViewMock,
    });
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("confirm", vi.fn(() => true));
    openMock.mockReset();
    scrollIntoViewMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the page outline and exposes live status in settings without a fake publish checkbox", async () => {
    vi.stubGlobal("fetch", mockFetchForEditor(pageWithBlocks));
    const user = userEvent.setup();

    render(<PageEditorPage params={Promise.resolve({ id: "page-1" })} />);

    expect(await screen.findByRole("heading", { name: /page outline/i })).toBeInTheDocument();
    expect(screen.getByText(/1 saved draft/i)).toBeInTheDocument();
    expect(screen.getByText(/working draft/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /settings/i }));

    expect(await screen.findByText(/live status/i)).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: /published/i })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /show in navigation/i })).toBeInTheDocument();
  });

  it("saves a dirty live page before opening preview", async () => {
    const patchedPage: MockPageResponse = {
      ...emptyPage,
      drafts: [
        {
          id: "draft-new",
          content: JSON.stringify([
            {
              id: "draft-heading",
              type: "heading",
              level: 2,
              text: "Section Heading",
              accent: "",
              centered: false,
            },
          ]),
          createdAt: "2026-05-12T16:02:00.000Z",
        },
      ],
      hasDraft: true,
      updatedAt: "2026-05-12T16:02:00.000Z",
    };
    const fetchMock = mockFetchForEditor(emptyPage, patchedPage);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<PageEditorPage params={Promise.resolve({ id: "page-1" })} />);

    expect(await screen.findByText(/your page is empty/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add block/i }));
    await user.click(
      screen.getByRole("button", {
        name: /heading section title with optional accent label/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: /preview/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/pages/page-1",
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    await waitFor(() => {
      expect(openMock).toHaveBeenCalledWith(
        "/admin/preview/page-1?draftId=draft-new",
        "_blank",
        "noopener,noreferrer",
      );
    });
  });
});