import { useState } from "react";
import type {
  UiTransactionFilters,
  TransactionFilters,
  TransactionKindFilter,
} from "../types";

export function useTransactionFilters(initial: UiTransactionFilters = {}) {
  const [q, setQ] = useState(initial.q ?? "");
  const [from, setFrom] = useState(initial.from || "");
  const [to, setTo] = useState(initial.to || "");
  const [kind, setKind] = useState<TransactionKindFilter>(initial.kind ?? "all");

  const filters: TransactionFilters = {
    q: q || undefined,
    from: from || undefined,
    to: to || undefined,
    kind,
  };

  const reset = () => {
    setQ("");
    setFrom("");
    setTo("");
    setKind("all");
  };

  return {
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
  };
}