import { useState } from "react";

export function usePaginationState(initialPage = 1, initialSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const goTo = (p: number) => {
    setPage(Math.max(1, Math.floor(p)));
  };

  const next = () => {
    setPage((p) => p + 1);
  };

  const prev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  return {
    page,
    pageSize,
    setPage: goTo,
    setPageSize,
    next,
    prev,
  };
}