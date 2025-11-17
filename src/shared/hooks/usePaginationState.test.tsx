import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePaginationState } from "./usePaginationState";

describe("usePaginationState", () => {
  it("uses initial page and pageSize", () => {
    const { result } = renderHook(() => usePaginationState(3, 20));

    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(20);
  });

  it("increments and decrements page with next/prev and never goes below 1", () => {
    const { result } = renderHook(() => usePaginationState(1, 10));

    act(() => {
      result.current.next();
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.prev();
    });
    expect(result.current.page).toBe(1);

    // cannot go below 1
    act(() => {
      result.current.prev();
    });
    expect(result.current.page).toBe(1);
  });

  it("setPage clamps to integer and minimum 1", () => {
    const { result } = renderHook(() => usePaginationState(1, 10));

    act(() => {
      result.current.setPage(5.9);
    });
    expect(result.current.page).toBe(5);

    act(() => {
      result.current.setPage(0);
    });
    expect(result.current.page).toBe(1);
  });

  it("can change pageSize", () => {
    const { result } = renderHook(() => usePaginationState(1, 10));

    act(() => {
      result.current.setPageSize(50);
    });
    expect(result.current.pageSize).toBe(50);
  });
});