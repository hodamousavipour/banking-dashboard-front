import { useState, useCallback } from "react";
import type { ToastType } from "../components/Toast";

export interface ToastState {
  message: string;
  type: ToastType;
  onUndo?: () => void; // optional
}

export interface ShowToastOptions {
  message: string;
  type?: ToastType;
  onUndo?: () => void; // optional
}

export function useToastState() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((options: ShowToastOptions) => {
    const { message, type = "info", onUndo } = options;
    setToast({ message, type, onUndo });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // sugar helpers (optional ولی خیلی کاربردی)
  const showSuccess = useCallback(
    (message: string, onUndo?: () => void) => {
      setToast({ message, type: "success", onUndo });
    },
    []
  );

  const showError = useCallback(
    (message: string, onUndo?: () => void) => {
      setToast({ message, type: "error", onUndo });
    },
    []
  );

  const showInfo = useCallback(
    (message: string, onUndo?: () => void) => {
      setToast({ message, type: "info", onUndo });
    },
    []
  );

  return {
    toast,        // null یا { message, type, onUndo }
    showToast,    // showToast({ message, type?, onUndo? })
    showSuccess,  // showSuccess("Done", optionalUndo)
    showError,
    showInfo,
    hideToast,    // برای بستن دستی یا از داخل Toast
  };
}