import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";
import type { DashboardSummary } from "../types";

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.summary,
    staleTime: 5_000,
  });
}