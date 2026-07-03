import { createContext, useContext, useState } from "react";

type Toast = {
  id: number;
  title: string;
  message: string;
};

type ToastContextType = {
  addToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext({} as ToastContextType);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(toast: Omit<Toast, "id">) {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, ...toast }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* UI GLOBAL DO TOAST */}
      <div className="fixed top-6 right-6 z-[9999] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="w-80 bg-white border-l-4 border-yellow-500 shadow-xl rounded-xl p-4 animate-slide-in"
          >
            <p className="font-semibold text-gray-800">✨ {t.title}</p>
            <p className="text-sm text-gray-600 mt-1">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);