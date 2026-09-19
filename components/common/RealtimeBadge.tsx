'use client';

import React from 'react';

interface RealtimeBadgeProps {
  lastUpdated?: string;
  className?: string;
}

export const RealtimeBadge: React.FC<RealtimeBadgeProps> = ({ lastUpdated, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-semibold text-emerald-600 dark:text-emerald-400">即時</span>
      <span className="text-slate-400 dark:text-slate-500">|</span>
      <span className="text-slate-500 dark:text-slate-400">模擬資料 {lastUpdated && `(${lastUpdated})`}</span>
    </div>
  );
};
