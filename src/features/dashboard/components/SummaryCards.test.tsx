// src/features/dashboard/components/SummaryCards.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SummaryCards from "./SummaryCards";

// mock currency formatter so we don't depend on real formatting
vi.mock("../../../lib/formatters/currencyFormat", () => ({
  currencyEUR: (value: number) => `EUR ${value}`,
}));

describe("SummaryCards", () => {
  it("renders placeholders when summary is undefined", () => {
    render(<SummaryCards />);

    // should show "—" for balance, income, expense
    const placeholders = screen.getAllByText("—");
    expect(placeholders).toHaveLength(3);
  });

  it("renders formatted balance, income and expense when summary is provided", () => {
    const summary = { balance: 1000, income: 1500, expense: 500 };

    render(<SummaryCards summary={summary} />);

    expect(screen.getByText("EUR 1000")).toBeInTheDocument();
    expect(screen.getByText("EUR 1500")).toBeInTheDocument();
    expect(screen.getByText("EUR 500")).toBeInTheDocument();
  });
});