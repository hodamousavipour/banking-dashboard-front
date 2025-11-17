interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
  };

  return (
    <div
      className={`${sizes[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
      role="status"
    />
  );
}