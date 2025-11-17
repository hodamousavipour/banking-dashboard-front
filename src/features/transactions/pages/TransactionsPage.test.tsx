import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionsPage from "./TransactionsPage";
import type { Transaction } from "../types";

let filtersMock: any;
let transactionsHookMock: any;
let toastMock: any;
let undoMock: any;
let paginationMock: any;

// ─── Mocks ──────────────────────────────────────────────────────────────

vi.mock("../hooks/useTransactionFilters", () => ({
  useTransactionFilters: () => filtersMock,
}));

vi.mock("../hooks/useTransactions", () => ({
  useTransactions: () => transactionsHookMock,
}));

vi.mock("../../../shared/hooks/useToastState", () => ({
  useToastState: () => toastMock,
}));

vi.mock("../../../shared/hooks/usePaginationState", () => ({
  usePaginationState: () => paginationMock,
}));

vi.mock("../hooks/useTransactionUndo", () => ({
  useTransactionUndo: () => undoMock,
}));

// we don't test internals of these components here
vi.mock("../components/TransactionFilters", () => ({
  __esModule: true,
  default: () => <div data-testid="filters" />,
}));

vi.mock("../components/TransactionForm", () => ({
  __esModule: true,
  default: ({ defaultValues }: any) => (
    <div data-testid="transaction-form">
      {defaultValues ? `editing:${defaultValues.description}` : "empty-form"}
    </div>
  ),
}));

vi.mock("../components/TransactionList", () => ({
  __esModule: true,
  default: ({ items, onDelete }: any) => (
    <div>
      <div data-testid="tx-count">{items.length}</div>
      {items.length > 0 && (
        <button type="button" onClick={() => onDelete(items[0])}>
          Delete first
        </button>
      )}
    </div>
  ),
}));

describe("TransactionsPage", () => {
  const sampleTx: Transaction = {
    id: 1,
    amount: -50,
    description: "Groceries",
    date: "2024-02-02T00:00:00.000Z",
  };

  beforeEach(() => {
    filtersMock = {
      filters: { q: "", from: "", to: "", kind: "all" },
      q: "",
      setQ: vi.fn(),
      from: "",
      setFrom: vi.fn(),
      to: "",
      setTo: vi.fn(),
      kind: "all",
      setKind: vi.fn(),
      reset: vi.fn(),
    };

    paginationMock = {
      page: 1,
      pageSize: 20,
      setPage: vi.fn(),
      next: vi.fn(),
      prev: vi.fn(),
    };

    transactionsHookMock = {
      transactions: [],
      isLoading: false,
      isFetching: false,
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn((_id: number, options?: any) => {
        options?.onSuccess?.();
      }),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    };

    toastMock = {
      toast: null,
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
      hideToast: vi.fn(),
    };

    undoMock = {
      registerCreated: vi.fn(),
      registerDeleted: vi.fn(() => vi.fn()),
      registerUpdated: vi.fn(),
    };
  });

  it("shows loading indicator when transactions are loading", () => {
    transactionsHookMock.isLoading = true;

    render(<TransactionsPage />);

    expect(screen.getByText(/loading…/i)).toBeInTheDocument();
  });

  it("opens delete modal and calls deleteTransaction + showInfo on confirm", async () => {
    const user = userEvent.setup();

    transactionsHookMock.transactions = [sampleTx];

    const undoFn = vi.fn();
    undoMock.registerDeleted = vi.fn(() => undoFn);

    render(<TransactionsPage />);

    // list shows 1 item and delete button
    expect(screen.getByTestId("tx-count")).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: /delete first/i }));

    // modal should open with description
    expect(
      screen.getByText(/are you sure you want to delete/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/groceries/i)).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /^delete$/i });
    await user.click(confirmButton);

    expect(transactionsHookMock.deleteTransaction).toHaveBeenCalledWith(
      sampleTx.id,
      expect.any(Object)
    );
    // because our deleteTransaction mock calls onSuccess, handleConfirmDelete
    // should call showInfo with undo
    expect(toastMock.showInfo).toHaveBeenCalledWith(
      "Transaction deleted",
      undoFn
    );
  });
});