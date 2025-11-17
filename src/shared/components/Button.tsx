import { type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type Variant = "primary" | "secondary" | "danger" | "gray";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";
const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};
const variants: Record<Variant, string> = {
  primary: "bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-cyan-500",
  secondary: "bg-amber-200 text-amber-900 hover:bg-amber-300 focus-visible:ring-amber-400",
  danger: "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-400",
  gray: "bg-gray-200 text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}