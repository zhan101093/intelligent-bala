"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
}

export function Toast({ message, visible, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onDismiss?.(), 3200);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-7 left-1/2 -translate-x-1/2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg pointer-events-none transition-all duration-300 z-50 whitespace-nowrap",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      {message}
    </div>
  );
}

export function useToast() {
  const [state, setState] = useState({ message: "", visible: false });

  const show = (message: string) =>
    setState({ message, visible: true });

  const dismiss = () =>
    setState((s) => ({ ...s, visible: false }));

  return { toast: state, show, dismiss };
}
