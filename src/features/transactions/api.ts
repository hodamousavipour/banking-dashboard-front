import { apiClient } from "../../lib/apiClient";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionsResponse,
  Transaction,
} from "./types";

export const transactionsApi = {
  
  list: async (): Promise<TransactionsResponse> => {
    const { data } = await apiClient.get<TransactionsResponse>("/transactions");
    return data;
  },

  create: async (payload: CreateTransactionInput): Promise<Transaction> => {
    const { data } = await apiClient.post<Transaction>("/transactions", payload);
    return data;
  },

  update: async (payload: UpdateTransactionInput): Promise<Transaction> => {
    const { id, ...body } = payload;
    const { data } = await apiClient.put<Transaction>(
      `/transactions/${id}`,
      body
    );
    return data;
  },

  remove: async (id: number): Promise<{ success: true }> => {
    const { data } = await apiClient.delete<{ success: true }>(
      `/transactions/${id}`
    );
    return data;
  },
};