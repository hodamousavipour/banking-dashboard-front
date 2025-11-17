// src/features/transactions/types.ts

export type TxId = number;

export type TransactionKindFilter = "all" | "deposits" | "withdrawals";

export interface Transaction {
  id: TxId;
  amount: number;           // positive = income, negative = expense
  description: string;
  date: string;             // ISO
}

export interface CreateTransactionInput {
  amount: number;
  description: string;
  date?: string;            // default today (server-side / MSW)
}

export interface UpdateTransactionInput {
  id: TxId;
  amount?: number;
  description?: string;
  date?: string;
}

export interface TransactionsResponse {
  items: Transaction[];
  total: number;
}


export interface TransactionFilters {
  q?: string;               // search description
  from?: string;            // YYYY-MM-DD
  to?: string;              // YYYY-MM-DD
  kind?: TransactionKindFilter;
}

export interface UiTransactionFilters {
  q?: string;
  from?: string;
  to?: string;
  kind?: TransactionKindFilter;
}