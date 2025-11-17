import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Content</div>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when open and shows title & children", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Modal">
        <p>Hi there</p>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("My Modal")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("calls onClose when clicking the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="My Modal">
        <p>Hi there</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText(/close/i);
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking on the backdrop", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Backdrop test">
        <p>Inside</p>
      </Modal>
    );

    const backdrop = screen.getByRole("dialog");

  fireEvent.click(backdrop);    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside the content", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Inner click">
        <button>Inside button</button>
      </Modal>
    );

    const innerButton = screen.getByText("Inside button");
    await user.click(innerButton);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on Escape key press", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Esc test">
        <p>Esc content</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});