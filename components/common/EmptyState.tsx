'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '目前沒有資料',
  description = '尚無符合條件的數據資料，請嘗試變更搜尋字詞或篩選條件。',
  action,
}) => {
  return (
    <div className="w-full py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
