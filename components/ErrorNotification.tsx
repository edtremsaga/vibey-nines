"use client";

import { useEffect } from "react";

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ErrorNotification({ message, onClose, duration = 5000 }: ErrorNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-xl p-4 shadow-lg max-w-md mx-4">
        <div className="flex items-start gap-3">
          <span className="text-red-600 dark:text-red-400 text-xl flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0"
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

