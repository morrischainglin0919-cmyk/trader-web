'use client';

import React from 'react';

interface LoadingSkeletonProps {
  message?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  message = '正在載入市場行情數據……',
}) => {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans animate-pulse">
        {message}
      </p>
    </div>
  );
};
