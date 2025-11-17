import { useState } from "react";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import SummaryCards from "../components/SummaryCards";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import AddTransactionModal from "../components/AddTransactionModal";

import { useTransactions } from "../../transactions/hooks/useTransactions";
import { CsvImportButton } from "../../transactions/components/CsvImportButton";
import { useTransactionsImport } from "../../transactions/hooks/useTransactionsImport";

import { Toast } from "../../../shared/components/Toast";
import { useToastState } from "../../../shared/hooks/useToastState";

import { useTransactionUndo } from "../../transactions/hooks/useTransactionUndo";
import type { CreateTransactionInput } from "../../transactions/types";

export default function DashboardPage() {
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useDashboardSummary();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating,
  } = useTransactions();

  const {
    toast,
    showSuccess,
    showError,
    showInfo,
    hideToast,
  } = useToastState();

  const { isImporting, handleFileSelected } = useTransactionsImport({
    existing: transactions,
    createTransaction,
    showSuccess,
    showError,
    showInfo,
  });

  const { registerCreated } = useTransactionUndo({
    createTransaction,
    updateTransaction,
    deleteTransaction,
    showSuccess,
    showError,
    showInfo,
  });

  const handleAddFromDashboard = (payload: CreateTransactionInput) => {
    createTransaction(payload, {
      onSuccess: (created) => {
        const undo = registerCreated(created);
        showSuccess("Transaction created successfully", undo);
        setIsAddOpen(false);
      },
      onError: () => {
        showError("Failed to create transaction");
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" onClick={() => setIsAddOpen(true)}>
            Add Transaction
          </Button>

          <CsvImportButton
            onFileSelected={handleFileSelected}
            isImporting={isImporting}
          />
        </div>
      </Card>

      <Card title="Overview">
        {isSummaryLoading && "Loading…"}

        {!isSummaryLoading && isSummaryError && (
          <div className="flex flex-col gap-3">
            <div className="text-sm text-red-600">
              Failed to load dashboard data. Please try again.
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => refetchSummary()}
            >
              Retry
            </Button>
          </div>
        )}

        {!isSummaryLoading && !isSummaryError && (
          <SummaryCards summary={summary} />
        )}
      </Card>

      <AddTransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddFromDashboard}
        isSubmitting={isCreating}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onUndo={toast.onUndo}
          onClose={hideToast}
        />
      )}
    </div>
  );
}