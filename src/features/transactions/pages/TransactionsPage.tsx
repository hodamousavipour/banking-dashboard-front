// src/features/transactions/pages/TransactionsPage.tsx

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
// --------------------------
// صفحه‌ی اصلی تراکنش‌ها
// --------------------------

export default function TransactionsPage() {
  // toast shared state (پیام + undo)
  const { toast, showSuccess, showError, showInfo, hideToast } = useToastState();

  // edit mode
  const [editing, setEditing] = useState<Transaction | null>(null);

  // reuse mode (پر کردن فرم برای ساخت رکورد جدید)
  const [reuseSource, setReuseSource] = useState<Transaction | null>(null);

  // حذف در انتظار تأیید (برای modal)
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  // فیلترهای UI
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

  // pagination فقط در فرانت
  const { page, pageSize, setPage } = usePaginationState(1, DEFAULT_PAGE_SIZE);

  // یک‌بار کل تراکنش‌ها را از API/MSW می‌گیریم
  const {
    transactions,
    isLoading,
    isFetching,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTransactions();

  const isSubmitting = isCreating || isUpdating;

  // undo helper: برای هر اکشن یک undo اختصاصی می‌سازد
  const { registerCreated, registerDeleted, registerUpdated } =
    useTransactionUndo({
      createTransaction,
      updateTransaction,
      deleteTransaction,
      showSuccess,
      showError,
      showInfo,
    });

  // وقتی فیلترها تغییر کنند، صفحه برگردد به ۱
  useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  // ۱) اعمال فیلترها: description + date range + نوع (Deposit/Withdrawal)
  const filtered = transactions.filter((tx) => {
    // description (q)
    if (filters.q) {
      const qLower = filters.q.toLowerCase();
      if (!tx.description.toLowerCase().includes(qLower)) return false;
    }

    // date range
    const txDate = tx.date.slice(0, 10); // YYYY-MM-DD

    if (filters.from && txDate < filters.from) return false;
    if (filters.to && txDate > filters.to) return false;

    // نوع: all / deposits / withdrawals بر اساس sign amount
    const amount = tx.amount;
    const currentKind = (filters.kind ?? "all") as TransactionKindFilter;

    if (currentKind === "deposits" && amount <= 0) return false;
    if (currentKind === "withdrawals" && amount >= 0) return false;

    return true;
  });
//   console.log("filters.kind =", filters.kind);
// console.log("all tx:", transactions.map((t) => [t.id, t.amount]));
// console.log("filtered:", filtered.map((t) => [t.id, t.amount]));

  // ۲) sort: جدیدترین اول
  const sortedTransactions = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const filteredCount = filtered.length;

  // ۳) pagination در فرانت
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

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    link.href = url;
    link.download = `transactions-${today}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };
  // defaultValues فرم بر اساس حالت فعلی
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

  // submit فرم بالا (Add / Edit / Reuse)
  const handleSubmit = (values: CreateTransactionFormData) => {
    if (editing) {
      // EDIT
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
            // undo مخصوص این آپدیت
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
      // CREATE (حالت عادی + Reuse)
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

  // حذف نهایی بعد از تأیید در modal
  const handleConfirmDelete = () => {
  if (!pendingDelete) return;

  const tx = pendingDelete;

  deleteTransaction(tx.id, {
    onSuccess: () => {
      const undo = registerDeleted(tx);
      showInfo("Transaction deleted", undo);

      setPendingDelete(null);

      // 🔹 اگر همین رکورد در حال ویرایش باشد، فرم را از حالت edit خارج کن
      setEditing((current) =>
        current && current.id === tx.id ? null : current
      );

      // (اختیاری) اگر بخوای در حالت reuse هم فرم خالی بشه:
      setReuseSource((current) =>
        current && current.id === tx.id ? null : current
      );
    },
    onError: () => {
      showError("Failed to delete transaction");
    },
  });
};
return (
    <div className="space-y-6">
      {/* فرم بالا: Add / Edit / Reuse */}
      <Card title={cardTitle}>
        <TransactionForm
          defaultValues={formDefaults}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
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

      {/* لیست تراکنش‌ها + فیلتر */}
      <Card title="Transactions">
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

        {/* تعداد نتایج */}
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
      </Card>

      {/* Confirm Delete Modal */}
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

      {/* Toast (با Undo اختیاری) */}
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