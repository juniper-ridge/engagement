import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import AdminLoginPage from "../page";

// next-auth/react is already mocked in vitest.setup.ts
// window.location.href assignment is mocked here
const mockLocationAssign = vi.fn();
Object.defineProperty(window, "location", {
  value: { href: "", assign: mockLocationAssign },
  writable: true,
});

describe("AdminLoginPage", () => {
  beforeEach(() => {
    vi.mocked(signIn).mockReset();
    mockLocationAssign.mockReset();
    window.location.href = "";
  });

  it("renders the login form with email and password fields", () => {
    render(<AdminLoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("renders the Admin Login heading", () => {
    render(<AdminLoginPage />);
    expect(
      screen.getByRole("heading", { name: /admin login/i }),
    ).toBeInTheDocument();
  });

  it("submit button is enabled initially", () => {
    render(<AdminLoginPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
  });

  it("shows error message when signIn returns an error", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: "CredentialsSignin",
      ok: false,
      status: 401,
      url: null,
    });
    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i),
      ).toBeInTheDocument();
    });
  });

  it("redirects to /admin on successful login", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: null,
      ok: true,
      status: 200,
      url: null,
    });
    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "correctpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(window.location.href).toBe("/admin");
    });
  });

  it("calls signIn with credentials provider and redirect: false", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: null,
      ok: true,
      status: 200,
      url: null,
    });
    const user = userEvent.setup();
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "mypassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({
          email: "admin@example.com",
          password: "mypassword",
          redirect: false,
        }),
      );
    });
  });
});
