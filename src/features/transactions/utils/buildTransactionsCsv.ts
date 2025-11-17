import type { Transaction } from "../types";

/**
 * Builds a CSV string for the given transactions.
 * Format:
 * Date,Amount,Description,Type
 * 2024-02-01,1000.50,Salary,Deposit
 */
export function buildTransactionsCsv(transactions: Transaction[]): string {
  const header = "Date,Amount,Description,Type";

  const rows = transactions.map((tx) => {
    const date = tx.date.slice(0, 10); // YYYY-MM-DD
    const amount = tx.amount.toFixed(2);

    // For simplicity, we remove commas from the description
    // because our current CSV parser does not support quoted commas.
    const description = tx.description.replace(/,/g, " ");

    const type = tx.amount >= 0 ? "Deposit" : "Withdrawal";

    return `${date},${amount},${description},${type}`;
  });

  return [header, ...rows].join("\n");
}