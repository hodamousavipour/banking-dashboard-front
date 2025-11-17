import { useEffect } from "react";
import { cn } from "../utils/cn";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number | null;   
  onUndo?: () => void;
  undoLabel?: string;
}

const palette: Record<ToastType, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-orange-600 text-white",
  info: "bg-amber-400 text-white",
};

export function Toast({
  message,
  type = "info",
  onClose,
  duration,
  onUndo,
  undoLabel = "Undo",
}: ToastProps) {
  
  const hasUndo = Boolean(onUndo);
  const shouldAutoClose = !hasUndo && typeof duration === "number";

  useEffect(() => {
    if (!shouldAutoClose) return;

    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose, shouldAutoClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm rounded-md px-4 py-4 text-sm shadow-lg cursor-pointer",
        palette[type]
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex-1">{message}</span>

        {onUndo && (
          <button
            type="button"
            onClick={() => {
              onUndo();
              onClose();
            }}
            className="text-xs underline underline-offset-2 cursor-pointer"
          >
            {undoLabel}
          </button>
        )}

        <button
          type="button"
          aria-label="Close notification"
          onClick={onClose}
          className="ml-1 text-lg leading-none cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
}