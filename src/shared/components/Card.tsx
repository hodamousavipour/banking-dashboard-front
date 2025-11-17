// src/shared/components/Card.tsx
import { type ReactNode } from "react";
import { cn } from "../utils/cn";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-lg shadow-sm border p-4 md:p-6",
        "bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)]",
        className
      )}
    >
      {title && (
        <h3 className="mb-2 font-semibold text-[var(--color-text)]/80">
          {title}
        </h3>
      )}

      {children}
    </section>
  );
}