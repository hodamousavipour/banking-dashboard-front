// src/features/dashboard/pages/DashboardPage.tsx
import { useState } from "react";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import SummaryCards from "../components/SummaryCards";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import AddTransactionModal from "../components/AddTransactionModal";

// از feature تراکنش‌ها:
import { useTransactions } from "../../transactions/hooks/useTransactions";
import { CsvImportButton } from "../../transactions/components/CsvImportButton";
import { useTransactionsImport } from "../../transactions/hooks/useTransactionsImport";

// toast مشترک
import { Toast } from "../../../shared/components/Toast";
import { useToastState } from "../../../shared/hooks/useToastState";

// Undo مشترک با صفحه‌ی تراکنش‌ها
import { useTransactionUndo } from "../../transactions/hooks/useTransactionUndo";
import type { CreateTransactionInput } from "../../transactions/types";

export default function DashboardPage() {
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // از سرور/MSW لیست تراکنش‌ها + create/update/delete
  const {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating,
  } = useTransactions();

  // toast state
  const {
    toast,
    showSuccess,
    showError,
    showInfo,
    hideToast,
  } = useToastState();

  // هوک import CSV
  const { isImporting, handleFileSelected } = useTransactionsImport({
    existing: transactions,
    createTransaction,
    showSuccess,
    showError,
    showInfo,
  });

  // فقط registerCreated فعلاً اینجا لازم‌مان است
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
        setIsAddOpen(false); // بعد از موفقیت مدال بسته شود
      },
      onError: () => {
        showError("Failed to create transaction");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* بالا: دکمه Add + Import */}
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

      {/* overview */}
      <Card title="Overview">
        {isSummaryLoading ? "Loading…" : <SummaryCards summary={summary} />}
      </Card>

      {/* modal اضافه‌کردن با Undo */}
      <AddTransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddFromDashboard}
        isSubmitting={isCreating}
      />

      {/* Toast مشترک */}
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