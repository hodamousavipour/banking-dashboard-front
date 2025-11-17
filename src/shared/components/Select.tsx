import React from "react";
import { cn } from "../utils/cn";

type Option = {
  value: string | number;
  label: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  className?: string;
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  const selectId = id || props.name;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-[var(--color-text)]/80"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        {...props}
        className={cn(
          "w-full rounded-md px-3 py-2 text-sm outline-none transition",

          "bg-[var(--color-card)] text-[var(--color-text)]",

          "border border-[var(--color-input-border)]",

          "text-[var(--color-text)]",

          "focus:ring-2 focus:ring-[var(--color-primary)]/40",

          "appearance-none",

          "bg-no-repeat bg-right bg-[length:14px_14px]",

          className
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg fill='none' stroke='%23889' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--color-card)]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}