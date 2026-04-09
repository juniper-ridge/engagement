import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders without crashing", () => {
    render(<Navbar />);
    expect(document.body).toBeTruthy();
  });

  it("contains a navigation element", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
