import { createContext, useContext, useState } from "react";

type Toast = {
  title: string;
  message: string;
};

type ToastContextType = {
  addToast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: any) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* UI simples */}
      <div className="fixed top-5 right-5 space-y-2 z-50">
        {toasts.map((t, i) => (
          <div
            key={i}
            className="bg-white shadow-lg border px-4 py-3 rounded-xl"
          >
            <p className="font-semibold">{t.title}</p>
            <p className="text-sm text-gray-600">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};