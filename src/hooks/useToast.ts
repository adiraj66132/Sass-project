import { useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let globalAddToast: ((message: string, type?: ToastType) => void) | null = null;

export function useToast() {
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    if (globalAddToast) {
      globalAddToast(message, type);
    }
  }, []);

  return { addToast };
}

export function setToastFunction(fn: typeof globalAddToast) {
  globalAddToast = fn;
}
