'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = '資料載入失敗，請稍後再試。',
  onRetry,
}) => {
  return (
    <div className="w-full py-12 px-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-sm text-red-900 dark:text-red-200 mb-1">行情資料載入異常</h3>
      <p className="text-xs text-red-600 dark:text-red-400 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> 重新嘗試
        </button>
      )}
    </div>
  );
};
