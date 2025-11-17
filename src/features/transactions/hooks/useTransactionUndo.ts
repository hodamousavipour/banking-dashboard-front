
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

export function useTransactionUndo({
  createTransaction,
  updateTransaction,
  deleteTransaction,
  showSuccess,
  showError,
  showInfo,
}: UseTransactionUndoDeps) {
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