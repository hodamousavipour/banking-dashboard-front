// src/features/transactions/hooks/useTransactionFormState.ts
import { useState } from "react";
import type { Transaction } from "../types";
import type { CreateTransactionFormData } from "../validation/transactionSchemas";

interface UseTransactionFormStateDeps {
  createTransaction: (
    input: CreateTransactionFormData,
    opts?: { onSuccess?: (tx: Transaction) => void; onError?: () => void }
  ) => void;
  updateTransaction: (
    input: { id: number } & CreateTransactionFormData,
    opts?: { onSuccess?: () => void; onError?: () => void }
  ) => void;

  registerCreated: (tx: Transaction) => void;
  registerUpdated: (before: Transaction, after: Transaction) => void;

  showSuccess: (msg: string, onUndo?: () => void) => void;
  showError: (msg: string) => void;

  handleUndo: () => void;
}

export function useTransactionFormState({
  createTransaction,
  updateTransaction,
  registerCreated,
  registerUpdated,
  showSuccess,
  showError,
  handleUndo,
}: UseTransactionFormStateDeps) {
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [reuseSource, setReuseSource] = useState<Transaction | null>(null);

  const isEditMode = Boolean(editing);

 let formDefaults: Partial<CreateTransactionFormData> | undefined;

if (editing) {
  formDefaults = {
    amount: editing.amount,
    description: editing.description,
    date: editing.date.slice(0, 10),
  };
} else if (reuseSource) {
  formDefaults = {
    amount: reuseSource.amount,
    description: reuseSource.description,
    date: reuseSource.date.slice(0, 10),
  };
} else {
  formDefaults = undefined;
}

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

  const startEdit = (tx: Transaction) => {
    setReuseSource(null);
    setEditing(tx);
  };

  const startReuse = (tx: Transaction) => {
    setEditing(null);
    setReuseSource(tx);
  };

  const cancelForm = () => {
    setEditing(null);
    setReuseSource(null);
  };

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
            registerUpdated(before, after);
            showSuccess("Transaction updated", handleUndo);
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
          registerCreated(created);
          showSuccess(
            reuseSource
              ? "Transaction created from template"
              : "Transaction created successfully",
            handleUndo
          );
          setReuseSource(null);
        },
        onError: () => {
          showError("Failed to create transaction");
        },
      });
    }
  };

  return {
    // state
    editing,
    reuseSource,
    isEditMode,

    // مشتق‌ها برای UI
    formDefaults,
    cardTitle,
    submitLabel,

    // event handlers
    startEdit,
    startReuse,
    cancelForm,
    handleSubmit,
  };
}