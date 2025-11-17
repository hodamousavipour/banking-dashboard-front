// src/features/transactions/hooks/useTransactionUndo.ts

import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../types";

type CreateFn = (
  input: CreateTransactionInput,
  options?: {
    onSuccess?: (created: Transaction) => void;
    onError?: (error: unknown) => void;
  }
) => void;

type UpdateFn = (
  input: UpdateTransactionInput,
  options?: {
    onSuccess?: (updated: Transaction) => void;
    onError?: (error: unknown) => void;
  }
) => void;

type DeleteFn = (
  id: number,
  options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  }
) => void;

interface UseTransactionUndoDeps {
  createTransaction: CreateFn;
  updateTransaction: UpdateFn;
  deleteTransaction: DeleteFn;

  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

/**
 * فقط register* برمی‌گرداند.
 * هر register یک تابع undo مخصوص همان اکشن می‌سازد.
 */
export function useTransactionUndo({
  createTransaction,
  updateTransaction,
  deleteTransaction,
  showSuccess,
  showError,
  showInfo,
}: UseTransactionUndoDeps) {
  // وقتی یک تراکنش جدید ساخته می‌شود، undo = حذفِ آن تراکنش
  const registerCreated = (tx: Transaction) => {
    return () => {
      deleteTransaction(tx.id, {
        onSuccess: () => {
          showInfo("Last creation undone");
        },
        onError: () => {
          showError("Failed to undo creation");
        },
      });
    };
  };

  // وقتی یک تراکنش حذف می‌شود، undo = ساخت مجدد همان تراکنش
  const registerDeleted = (tx: Transaction) => {
    return () => {
      createTransaction(
        {
          amount: tx.amount,
          description: tx.description,
          date: tx.date,
        },
        {
          onSuccess: () => {
            showSuccess("Deletion undone");
          },
          onError: () => {
            showError("Failed to undo deletion");
          },
        }
      );
    };
  };

  // وقتی یک تراکنش آپدیت می‌شود، undo = برگرداندن به state قبلی
  const registerUpdated = (before: Transaction, _after: Transaction) => {
    return () => {
      updateTransaction(
        {
          id: before.id,
          amount: before.amount,
          description: before.description,
          date: before.date,
        },
        {
          onSuccess: () => {
            showSuccess("Update undone");
          },
          onError: () => {
            showError("Failed to undo update");
          },
        }
      );
    };
  };

  return {
    registerCreated,
    registerDeleted,
    registerUpdated,
  };
}