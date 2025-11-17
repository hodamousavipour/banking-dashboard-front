import { useState, useCallback } from "react";
import type { CreateTransactionInput, Transaction } from "../types";
import { parseTransactionsCsv } from "../utils/parseTransactionsCsv";

interface UseTransactionsImportOptions {
  existing: Transaction[];
  createTransaction: (input: CreateTransactionInput) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

export function useTransactionsImport({
  existing,
  createTransaction,
  showSuccess,
  showError,
  showInfo,
}: UseTransactionsImportOptions) {
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!file) return;

      if (
        !file.name.toLowerCase().endsWith(".csv") &&
        file.type !== "text/csv"
      ) {
        showError("Please upload a .csv file.");
        return;
      }

      setIsImporting(true);
      try {
        const text = await file.text();
        const { toCreate, errors, duplicateCount } = parseTransactionsCsv(
          text,
          existing
        );

        if (errors.length > 0) {
          const firstErrors = errors.slice(0, 3).join(" | ");
          showError(`Invalid CSV: ${firstErrors}`);
          return;
        }

        if (toCreate.length === 0) {
          if (duplicateCount > 0) {
            showInfo(
              `No new transactions to import. ${duplicateCount} duplicate record(s) were skipped.`
            );
          } else {
            showInfo("No transactions found in the file.");
          }
          return;
        }

        toCreate.forEach((input) => {
          createTransaction(input);
        });

        const msgParts = [`Imported ${toCreate.length} transaction(s).`];
        if (duplicateCount > 0) {
          msgParts.push(`${duplicateCount} duplicate(s) skipped.`);
        }

        showSuccess(msgParts.join(" "));
      } catch (err) {
        console.error("CSV import error:", err);
        showError("Failed to read or parse the CSV file.");
      } finally {
        setIsImporting(false);
      }
    },
    [existing, createTransaction, showSuccess, showError, showInfo]
  );

  return {
    isImporting,
    handleFileSelected,
  };
}