import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--color-text)]/80"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-md px-3 py-2 text-sm outline-none transition",

            /* Background + Text */
            "bg-[var(--color-input-bg)] text-[var(--color-text)]",

            /* Border */
            error
              ? "border border-red-500"
              : "border border-[var(--color-input-border)]",

            /* Placeholder */
            "placeholder:text-[var(--color-text)]/40",

            /* Focus Ring */
            error
              ? "focus:ring-2 focus:ring-red-400"
              : "focus:ring-2 focus:ring-[var(--color-primary)]/40",

            className
          )}
          {...props}
        />

        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";