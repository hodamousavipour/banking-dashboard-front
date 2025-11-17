// src/features/dashboard/api.ts
import { apiClient } from "../../lib/apiClient";
import type { DashboardSummary } from "./types";

export const dashboardApi = {
  summary: async (): Promise<DashboardSummary> => {
    const { data } = await apiClient.get<DashboardSummary>("/summary");
    return data;
  },
};