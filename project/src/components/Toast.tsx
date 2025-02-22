import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ show, message, type, onClose }: ToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg animate-slide-up transition-all">
      {type === 'success' ? (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}