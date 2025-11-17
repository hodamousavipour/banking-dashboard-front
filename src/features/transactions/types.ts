
export type TxId = number;

export type TransactionKindFilter = "all" | "deposits" | "withdrawals";

export interface Transaction {
  id: TxId;
  amount: number;           
  description: string;
  date: string;             
}

export interface CreateTransactionInput {
  amount: number;
  description: string;
  date?: string;            
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
  q?: string;               
  from?: string;            
  to?: string;             
  kind?: TransactionKindFilter;
}

export interface UiTransactionFilters {
  q?: string;
  from?: string;
  to?: string;
  kind?: TransactionKindFilter;
}