'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 3500;
const MAX_TOASTS = 3;

const toastStyles: Record<ToastType, { container: string; icon: React.ReactNode }> = {
    success: {
        container: 'border-emerald-200 bg-white',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    },
    error: {
        container: 'border-red-200 bg-white',
        icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
    },
    info: {
        container: 'border-brand-200 bg-white',
        icon: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
    },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = 'toast-' + ++idRef.current;
        setToasts(prev => {
            const next = [...prev, { id, type, message }];
            return next.slice(-MAX_TOASTS);
        });
        setTimeout(() => dismiss(id), TOAST_DURATION);
    }, [dismiss]);

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 px-4 w-full max-w-sm pointer-events-none">
                {toasts.map(toast => {
                    const style = toastStyles[toast.type];
                    return (
                        <div
                            key={toast.id}
                            role="status"
                            className={`pointer-events-auto w-full flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg shadow-black/5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${style.container}`}
                        >
                            {style.icon}
                            <p className="flex-1 text-xs font-bold text-gray-800 leading-relaxed">{toast.message}</p>
                            <button
                                onClick={() => dismiss(toast.id)}
                                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                                aria-label="Dismiss"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextType {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return ctx;
}
