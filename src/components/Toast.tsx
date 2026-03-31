"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

// ---- Tipos ----
export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

// ---- Context ----
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}

// ---- Item individual ----
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3500);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const styles = {
    success: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
    error: "bg-rose-500/10 border-rose-500/40 text-rose-400",
    warning: "bg-amber-500/10 border-amber-500/40 text-amber-400",
    info: "bg-sky-500/10 border-sky-500/40 text-sky-400",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg backdrop-blur-sm animate-fade-in ${styles[toast.type]}`}
    >
      <span className="text-base">{icons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onRemove}
        className="opacity-60 hover:opacity-100 transition text-xs"
      >
        ✕
      </button>
    </div>
  );
}

// ---- Provider + Container ----
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Container fixo no canto inferior direito */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;