'use client';

import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-[#120C0A]/95 border-emerald-500/40 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-[#120C0A]/95 border-rose-500/40 text-rose-100'
                : 'bg-[#120C0A]/95 border-[#FF6803]/40 text-white'
            }`}
          >
            <div className="mr-3 mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#FF6803]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-display font-bold leading-snug">{toast.title}</h4>
              {toast.message && <p className="text-[11px] mt-1 text-[#BFBFBF] leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-[#BFBFBF] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
