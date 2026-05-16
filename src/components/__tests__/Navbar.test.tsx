import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders without crashing", () => {
    render(<Navbar />);
    expect(document.body).toBeTruthy();
  });

  it("renders the brand and mobile menu toggle", () => {
    render(<Navbar />);
    expect(screen.getByText(/juniper ridge/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/toggle navigation menu/i),
    ).toBeInTheDocument();
  });

  it("contains both desktop and mobile navigation landmarks", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /mobile navigation/i }),
    ).toBeInTheDocument();
  });
});
