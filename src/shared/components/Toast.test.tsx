// src/shared/components/Toast.test.tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";

describe("Toast component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders message and default type info", () => {
    const onClose = vi.fn();

    render(<Toast message="Hello" onClose={onClose} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("auto closes after duration when there is no undo", async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast message="Auto close" onClose={onClose} duration={1000} />);

    // زمان را جلو می‌بریم
    await vi.advanceTimersByTimeAsync(1000);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT auto close when undo is provided (even with duration)", async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const onUndo = vi.fn();

    render(
      <Toast
        message="No auto close"
        onClose={onClose}
        onUndo={onUndo}
        duration={1000}
      />
    );

    await vi.advanceTimersByTimeAsync(2000);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onUndo then onClose when undo button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onUndo = vi.fn();

    render(
      <Toast
        message="Undo toast"
        onClose={onClose}
        onUndo={onUndo}
      />
    );

    const undoButton = screen.getByRole("button", { name: /undo/i });
    await user.click(undoButton);

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Toast message="Closable" onClose={onClose} />);

    const closeButton = screen.getByLabelText(/close notification/i);
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});