import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'error', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === 'error'
      ? 'bg-red-500 dark:bg-red-600'
      : type === 'success'
        ? 'bg-green-500 dark:bg-green-600'
        : 'bg-blue-500 dark:bg-blue-600';

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in max-w-md`}
    >
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

