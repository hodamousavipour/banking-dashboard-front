import { describe, it, expect, vi } from "vitest";
import { useTransactionUndo } from "./useTransactionUndo";
import type { Transaction } from "../types";

const sampleTx: Transaction = {
  id: 1,
  amount: 100,
  description: "Sample",
  date: "2024-02-01T00:00:00.000Z",
};

describe("useTransactionUndo", () => {
  it("registerCreated returns undo that deletes transaction and shows info on success", () => {
    const deleteTransaction = vi.fn((_id, options?: any) => {
      options?.onSuccess?.();
    });
    const showInfo = vi.fn();
    const showError = vi.fn();
    const showSuccess = vi.fn();

    const { registerCreated } = useTransactionUndo({
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction,
      showSuccess,
      showError,
      showInfo,
    });

    const undo = registerCreated(sampleTx);
    undo();

    expect(deleteTransaction).toHaveBeenCalledWith(sampleTx.id, expect.any(Object));
    expect(showInfo).toHaveBeenCalledWith("Last creation undone");
  });

  it("registerDeleted returns undo that recreates transaction and shows success on success", () => {
    const createTransaction = vi.fn((_input, options?: any) => {
      options?.onSuccess?.({ ...sampleTx });
    });
    const showInfo = vi.fn();
    const showError = vi.fn();
    const showSuccess = vi.fn();

    const { registerDeleted } = useTransactionUndo({
      createTransaction,
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
      showSuccess,
      showError,
      showInfo,
    });

    const undo = registerDeleted(sampleTx);
    undo();

    expect(createTransaction).toHaveBeenCalledWith(
      {
        amount: sampleTx.amount,
        description: sampleTx.description,
        date: sampleTx.date,
      },
      expect.any(Object)
    );
    expect(showSuccess).toHaveBeenCalledWith("Deletion undone");
  });

  it("registerUpdated returns undo that restores previous transaction and shows success", () => {
    const before: Transaction = {
      id: 1,
      amount: 10,
      description: "Before",
      date: "2024-01-01T00:00:00.000Z",
    };
    const after: Transaction = {
      id: 1,
      amount: 20,
      description: "After",
      date: "2024-02-01T00:00:00.000Z",
    };

    const updateTransaction = vi.fn((_input, options?: any) => {
      options?.onSuccess?.(after);
    });
    const showSuccess = vi.fn();
    const showError = vi.fn();
    const showInfo = vi.fn();

    const { registerUpdated } = useTransactionUndo({
      createTransaction: vi.fn(),
      updateTransaction,
      deleteTransaction: vi.fn(),
      showSuccess,
      showError,
      showInfo,
    });

    const undo = registerUpdated(before, after);
    undo();

    expect(updateTransaction).toHaveBeenCalledWith(
      {
        id: before.id,
        amount: before.amount,
        description: before.description,
        date: before.date,
      },
      expect.any(Object)
    );
    expect(showSuccess).toHaveBeenCalledWith("Update undone");
  });
});