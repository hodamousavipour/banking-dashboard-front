// src/features/transactions/hooks/useTransactionListView.ts
import { useEffect, useMemo } from "react";
import { useTransactionFilters } from "./useTransactionFilters";
import { usePaginationState } from "../../../shared/hooks/usePaginationState";
import { DEFAULT_PAGE_SIZE } from "../../../shared/constants";
import type { Transaction, TransactionKindFilter } from "../types";

export function useTransactionListView(allTransactions: Transaction[]) {
  // فیلترهای UI (description, date range, kind)
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

  // وقتی فیلتر عوض شد برگرد صفحه ۱
  useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  // ۱) filter
  const filtered = useMemo(() => {
    return allTransactions.filter((tx) => {
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
  }, [allTransactions, filters]);

  // ۲) sort: جدیدترین اول
  const sortedTransactions = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [filtered]
  );

  const filteredCount = sortedTransactions.length;

  // ۳) pagination
  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = useMemo(
    () => sortedTransactions.slice(start, end),
    [sortedTransactions, start, end]
  );

  return {
    // state + setters برای UI
    q,
    setQ,
    from,
    setFrom,
    to,
    setTo,
    kind,
    setKind,
    reset,
    filters,

    // pagination state
    page,
    pageSize,
    setPage,
    totalPages,

    // داده مشتق شده
    filteredCount,
    sortedTransactions,
    pageItems,
  };
}