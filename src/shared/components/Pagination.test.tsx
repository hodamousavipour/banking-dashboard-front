import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination component", () => {
  it("shows current page and total pages", () => {
    render(
      <Pagination
        page={1}
        total={100}
        pageSize={10}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByText(/Page 1 of 10/i)).toBeInTheDocument();
  });

  it("disables Prev on first page and enables Next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={1}
        total={100}
        pageSize={10}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole("button", { name: /prev/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    await user.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(2);

    await user.click(prevButton);
    // چون disabled است، نباید handler صدا شود
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("disables Next on last page", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={5}
        total={50}
        pageSize={10}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole("button", { name: /prev/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
  });
});