// src/features/dashboard/types.ts
export interface DashboardSummary {
  income: number;
  expense: number; // negative total (server may return negative or absolute; we’ll format)
  balance: number;
}