import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TransactionFilters from "../components/TransactionFilters";
import { useTransactionFilters } from "../hooks/useTransactionFilters";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction, TransactionKindFilter } from "../types";
import type { CreateTransactionFormData } from "../validation/transactionSchemas";
import { Pagination } from "../../../shared/components/Pagination";
import { Card } from "../../../shared/components/Card";
import { Toast } from "../../../shared/components/Toast";
import { Modal } from "../../../shared/components/Modal";
import { Button } from "../../../shared/components/Button";
import { usePaginationState } from "../../../shared/hooks/usePaginationState";
import { DEFAULT_PAGE_SIZE } from "../../../shared/constants";
import { useToastState } from "../../../shared/hooks/useToastState";
import { useTransactionUndo } from "../hooks/useTransactionUndo";
import { buildTransactionsCsv } from "../utils/buildTransactionsCsv";

export default function TransactionsPage() {
  const { toast, showSuccess, showError, showInfo, hideToast } = useToastState();

  const [editing, setEditing] = useState<Transaction | null>(null);
  const [reuseSource, setReuseSource] = useState<Transaction | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  const {
    filters,
    q,
    setQ,
    from,
    setFrom,
    to,
    setTo,
    kind,
    setKind,
    reset,
  } = useTransactionFilters({ kind: "all" });

  const { page, pageSize, setPage } = usePaginationState(1, DEFAULT_PAGE_SIZE);

  const {
    transactions,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTransactions();

  const isSubmitting = isCreating || isUpdating;

  const currentBalance = transactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const { registerCreated, registerDeleted, registerUpdated } =
    useTransactionUndo({
      createTransaction,
      updateTransaction,
      deleteTransaction,
      showSuccess,
      showError,
      showInfo,
    });

  useEffect(() => {
    setPage(1);
  }, [q, from, to, kind]);

  const filtered = transactions.filter((tx) => {
    if (filters.q) {
      const qLower = filters.q.toLowerCase();
      if (!tx.description.toLowerCase().includes(qLower)) return false;
    }

    const txDate = tx.date.slice(0, 10);
    if (filters.from && txDate < filters.from) return false;
    if (filters.to && txDate > filters.to) return false;

    const amount = tx.amount;
    const currentKind = (filters.kind ?? "all") as TransactionKindFilter;
    if (currentKind === "deposits" && amount <= 0) return false;
    if (currentKind === "withdrawals" && amount >= 0) return false;

    return true;
  });

  const sortedTransactions = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredCount = filtered.length;

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = sortedTransactions.slice(start, end);

  const handleExportCsv = () => {
    if (sortedTransactions.length === 0) {
      showInfo("No transactions to export for current filters.");
      return;
    }

    const csv = buildTransactionsCsv(sortedTransactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `transactions-${today}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formDefaults: Partial<CreateTransactionFormData> | undefined =
    editing
      ? {
          amount: editing.amount,
          description: editing.description,
          date: editing.date.slice(0, 10),
        }
      : reuseSource
      ? {
          amount: reuseSource.amount,
          description: reuseSource.description,
          date: reuseSource.date.slice(0, 10),
        }
      : undefined;

  const isEditMode = Boolean(editing);

  const cardTitle = isEditMode
    ? "Edit Transaction"
    : reuseSource
    ? "Reuse Transaction"
    : "Add Transaction";

  const submitLabel = isEditMode
    ? "Save changes"
    : reuseSource
    ? "Create from this template"
    : "Add transaction";

  const handleSubmit = (values: CreateTransactionFormData) => {
    if (editing) {
      const before = editing;
      const after: Transaction = {
        ...editing,
        amount: values.amount,
        description: values.description,
        date: values.date,
      };

      updateTransaction(
        { id: editing.id, ...values },
        {
          onSuccess: () => {
            const undo = registerUpdated(before, after);
            showSuccess("Transaction updated", undo);
            setEditing(null);
          },
          onError: () => {
            showError("Failed to update transaction");
          },
        }
      );
    } else {
      createTransaction(values, {
        onSuccess: (created) => {
          const undo = registerCreated(created);
          showSuccess(
            reuseSource
              ? "Transaction created from template"
              : "Transaction created successfully",
            undo
          );
          setReuseSource(null);
        },
        onError: () => {
          showError("Failed to create transaction");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    const tx = pendingDelete;

    deleteTransaction(tx.id, {
      onSuccess: () => {
        const undo = registerDeleted(tx);
        showInfo("Transaction deleted", undo);

        setPendingDelete(null);

        setEditing((current) =>
          current && current.id === tx.id ? null : current
        );

        setReuseSource((current) =>
          current && current.id === tx.id ? null : current
        );
      },
      onError: () => {
        showError("Failed to delete transaction");
      },
    });
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
      ? String(error)
      : null;

  return (
    <div className="space-y-6">
      <Card title={cardTitle}>
        <TransactionForm
          defaultValues={formDefaults}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
          currentBalance={currentBalance}   
          onCancel={
            isEditMode || reuseSource
              ? () => {
                  setEditing(null);
                  setReuseSource(null);
                }
              : undefined
          }
        />
      </Card>

      <Card title="Transactions">
        {isError && (
          <div className="flex flex-col gap-3 p-4 text-red-600">
            <div className="text-sm">
              Failed to load transactions. Please try again.
            </div>

            {errorMessage && (
              <div className="text-xs text-red-500">
                Details: {errorMessage}
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {!isError && (
          <>
            <div className="flex items-end mb-3">
              <TransactionFilters
                q={q}
                setQ={setQ}
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
                kind={kind as TransactionKindFilter}
                setKind={setKind}
                reset={reset}
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {isFetching ? "Updating..." : ""}
                </span>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={sortedTransactions.length === 0}
                >
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-3 mb-2">
              Total results: {filteredCount}
            </div>

            {isLoading ? (
              <div>Loading…</div>
            ) : (
              <>
                <TransactionList
                  items={pageItems}
                  onEdit={(tx) => {
                    setReuseSource(null);
                    setEditing(tx);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onDelete={(tx) => {
                    setPendingDelete(tx);
                  }}
                  onReuse={(tx) => {
                    setEditing(null);
                    setReuseSource(tx);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    showInfo("Adjust and submit to create a new one.");
                  }}
                />

                {totalPages > 1 && (
                  <div className="pt-3">
                    <Pagination
                      page={page}
                      total={sortedTransactions.length}
                      pageSize={pageSize}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>

      <Modal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete transaction?"
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {pendingDelete?.description ?? "this transaction"}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPendingDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={!pendingDelete || isDeleting}
            onClick={handleConfirmDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>

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