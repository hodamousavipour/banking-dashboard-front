import { cn } from "../utils/cn";
import { Button } from "./Button";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Simple, accessible pagination. */
export function Pagination({ page, total, pageSize, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button variant="gray" size="sm" onClick={() => onPageChange(page - 1)} disabled={!canPrev}>
          Prev
        </Button>
        <Button variant="gray" size="sm" onClick={() => onPageChange(page + 1)} disabled={!canNext}>
          Next
        </Button>
      </div>
    </div>
  );
}