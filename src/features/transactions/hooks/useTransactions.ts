import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../api";
import type {
  TransactionsResponse,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../types";

const KEY = ["transactions"] as const;

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

  const createMutation = useMutation({
    mutationFn: (input: CreateTransactionInput) => transactionsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateTransactionInput) => transactionsApi.update(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transactionsApi.remove(id),
    onSuccess: () => {
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