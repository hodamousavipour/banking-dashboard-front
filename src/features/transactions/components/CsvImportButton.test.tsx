import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CsvImportButton } from "./CsvImportButton";

vi.mock("../../../shared/components/Button", () => ({
  Button: ({ loading, children, ...rest }: any) => (
    <button data-loading={loading ? "true" : "false"} {...rest}>
      {children}
    </button>
  ),
}));

describe("CsvImportButton", () => {
  it("calls onFileSelected when a file is chosen", async () => {
    const onFileSelected = vi.fn();
    render(
      <CsvImportButton
        onFileSelected={onFileSelected}
        isImporting={false}
      />
    );

    const input = screen.getByRole("button", { name: /import csv/i }).previousElementSibling as HTMLInputElement;

    const file = new File(["Date,Amount,Description,Type"], "test.csv", {
      type: "text/csv",
    });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onFileSelected).toHaveBeenCalledTimes(1);
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("shows Import CSV button and passes loading state", () => {
    const onFileSelected = vi.fn();

    render(
      <CsvImportButton
        onFileSelected={onFileSelected}
        isImporting={true}
      />
    );

    const button = screen.getByRole("button", { name: /import csv/i });
    expect(button).toHaveAttribute("data-loading", "true");
  });
});