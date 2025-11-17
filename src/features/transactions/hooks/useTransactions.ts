import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../api";
import type {
  Transaction,
  TransactionsResponse,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../types";

const KEY = ["transactions"] as const;
let tempIdCounter = -1; // آیدی‌های موقت منفی و یکتا

function getNextTempId() {
  return tempIdCounter--;
}
export function useTransactions() {
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<TransactionsResponse>({
    queryKey: KEY,
    queryFn: () => transactionsApi.list(),
    placeholderData: (prev) => prev,
  });

  // CREATE (optimistic)
  const createMutation = useMutation({
    mutationFn: (input: CreateTransactionInput) => transactionsApi.create(input),
    onMutate: async (input) => {
    //  console.log("MUTATE createTransaction called with:", input);

      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<TransactionsResponse>(KEY);
      if (prev) {
        const optimistic: Transaction = {
          id: getNextTempId(),
          amount: input.amount,
          description: input.description,
          date: input.date ?? new Date().toISOString(),
        };
        qc.setQueryData<TransactionsResponse>(KEY, {
          ...prev,
          items: [optimistic, ...prev.items],
          total: prev.total + 1,
        });
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  // UPDATE (optimistic)
  const updateMutation = useMutation({
    mutationFn: (input: UpdateTransactionInput) => transactionsApi.update(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<TransactionsResponse>(KEY);
      if (prev) {
        qc.setQueryData<TransactionsResponse>(KEY, {
          ...prev,
          items: prev.items.map((t) =>
            t.id === input.id ? ({ ...t, ...input } as Transaction) : t
          ),
        });
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  // DELETE (optimistic)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => transactionsApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<TransactionsResponse>(KEY);
      if (prev) {
        qc.setQueryData<TransactionsResponse>(KEY, {
          ...prev,
          items: prev.items.filter((t) => t.id !== id),
          total: Math.max(0, prev.total - 1),
        });
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  return {
    data,
    transactions: data?.items ?? [],
    total: data?.items?.length ?? 0,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    createTransaction: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTransaction: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}