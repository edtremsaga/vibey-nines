"use client";

import { useEffect } from "react";

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessNotification({ message, onClose, duration = 3000 }: SuccessNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-xl p-4 shadow-lg max-w-md mx-4">
        <div className="flex items-start gap-3">
          <span className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900 dark:text-green-200">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 flex-shrink-0"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

