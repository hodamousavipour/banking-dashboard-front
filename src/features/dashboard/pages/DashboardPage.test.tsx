import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "./DashboardPage";

let summaryMock: any;
let transactionsMock: any;
let importMock: any;
let toastMock: any;

vi.mock("../hooks/useDashboardSummary", () => ({
  useDashboardSummary: () => summaryMock,
}));

vi.mock("../../transactions/hooks/useTransactions", () => ({
  useTransactions: () => transactionsMock,
}));

vi.mock("../../transactions/hooks/useTransactionsImport", () => ({
  useTransactionsImport: () => importMock,
}));

vi.mock("../components/SummaryCards", () => ({
  __esModule: true,
  default: ({ summary }: any) => (
    <div data-testid="summary-cards">
      {summary ? `balance:${summary.balance}` : "empty-summary"}
    </div>
  ),
}));

vi.mock("../../transactions/components/CsvImportButton", () => ({
  CsvImportButton: ({ isImporting }: any) => (
    <button type="button" data-testid="csv-import">
      {isImporting ? "Importing…" : "Import CSV"}
    </button>
  ),
}));

vi.mock("../components/AddTransactionModal", () => ({
  __esModule: true,
  default: ({ isOpen }: any) =>
    isOpen ? (
      <div data-testid="add-transaction-modal">Add Transaction Modal</div>
    ) : null,
}));

vi.mock("../../../shared/hooks/useToastState", () => ({
  useToastState: () => toastMock,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    summaryMock = {
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    };

    transactionsMock = {
      transactions: [],
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
      isCreating: false,
    };

    importMock = {
      isImporting: false,
      handleFileSelected: vi.fn(),
    };

    toastMock = {
      toast: null,
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
      hideToast: vi.fn(),
    };
  });

  it("shows loading state when summary is loading", () => {
    summaryMock.isLoading = true;

    render(<DashboardPage />);

    expect(screen.getByText(/loading…/i)).toBeInTheDocument();
  });

  it("renders summary cards when summary is loaded", () => {
    summaryMock.data = { balance: 100, income: 150, expense: 50 };
    summaryMock.isLoading = false;

    render(<DashboardPage />);

    const summary = screen.getByTestId("summary-cards");
    expect(summary).toHaveTextContent("balance:100");
  });

  it("shows error state and allows retry when summary fails", async () => {
    const user = userEvent.setup();
    summaryMock.isError = true;

    render(<DashboardPage />);

    expect(
      screen.getByText(/Failed to load dashboard data/i)
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);

    expect(summaryMock.refetch).toHaveBeenCalledTimes(1);
  });

  it("opens Add Transaction modal when button is clicked", async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    const button = screen.getByRole("button", { name: /add transaction/i });
    await user.click(button);

    expect(
      screen.getByTestId("add-transaction-modal")
    ).toBeInTheDocument();
  });

  it("renders Toast when toast state has a message", () => {
    toastMock.toast = {
      message: "Hello toast",
      type: "success",
      onUndo: undefined,
    };

    render(<DashboardPage />);

    expect(screen.getByText("Hello toast")).toBeInTheDocument();
  });
});