import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToastState } from "./useToastState";

describe("useToastState", () => {
  it("starts with null toast", () => {
    const { result } = renderHook(() => useToastState());
    expect(result.current.toast).toBeNull();
  });

  it("showToast sets toast with defaults", () => {
    const undo = vi.fn();
    const { result } = renderHook(() => useToastState());

    act(() => {
      result.current.showToast({
        message: "Hello",
        onUndo: undo,
      });
    });

    expect(result.current.toast).toEqual({
      message: "Hello",
      type: "info",
      onUndo: undo,
    });
  });

  it("showSuccess / showError / showInfo set correct types", () => {
    const { result } = renderHook(() => useToastState());

    act(() => {
      result.current.showSuccess("Done");
    });
    expect(result.current.toast).toEqual({
      message: "Done",
      type: "success",
      onUndo: undefined,
    });

    act(() => {
      result.current.showError("Oops");
    });
    expect(result.current.toast).toEqual({
      message: "Oops",
      type: "error",
      onUndo: undefined,
    });

    act(() => {
      result.current.showInfo("Info");
    });
    expect(result.current.toast).toEqual({
      message: "Info",
      type: "info",
      onUndo: undefined,
    });
  });

  it("hideToast clears toast", () => {
    const { result } = renderHook(() => useToastState());

    act(() => {
      result.current.showInfo("Something");
    });
    expect(result.current.toast).not.toBeNull();

    act(() => {
      result.current.hideToast();
    });
    expect(result.current.toast).toBeNull();
  });
});