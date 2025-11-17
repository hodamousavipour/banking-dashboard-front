import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

const defaultOptions: DefaultOptions = {
  queries: {
    retry: (failureCount, error) => {
      const status = (error as any)?.response?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    staleTime: 10_000,
    gcTime: 5 * 60 * 1000,
  },
  mutations: {
    retry: 0,
  },
};

export const queryClient = new QueryClient({
  defaultOptions,
});