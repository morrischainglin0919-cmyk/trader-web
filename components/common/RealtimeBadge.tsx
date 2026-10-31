'use client';

import React from 'react';

interface RealtimeBadgeProps {
  lastUpdated?: string;
  isRealTime?: boolean;
  source?: string;
  className?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const RealtimeBadge: React.FC<RealtimeBadgeProps> = ({
  lastUpdated,
  isRealTime = true,
  source = 'Yahoo Finance API',
  className = '',
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRealTime ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealTime ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
      </span>
      <span className={`font-semibold ${isRealTime ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {isRealTime ? '即時' : '模擬'}
      </span>
      <span className="text-slate-400 dark:text-slate-500">|</span>
      <span className="text-slate-500 dark:text-slate-400">
        {source} {lastUpdated && `(${lastUpdated})`}
      </span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="重新整理 Yahoo Finance 即時行情"
          className="ml-1 text-[11px] text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50 cursor-pointer"
        >
          {isRefreshing ? '更新中...' : '🔄 刷新'}
        </button>
      )}
    </div>
  );
};
