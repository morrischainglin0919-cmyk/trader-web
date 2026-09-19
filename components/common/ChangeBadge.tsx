'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChangeBadgeProps {
  changePercent: number;
  changeAmount?: number;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ChangeBadge: React.FC<ChangeBadgeProps> = ({
  changePercent,
  changeAmount,
  showIcon = true,
  className = '',
  size = 'md',
}) => {
  const { colorRule } = useApp();

  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const isZero = changePercent === 0;

  // Determine colors based on TW/US standard setting
  let textColor = 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
  let icon = <Minus className="w-3.5 h-3.5" />;

  if (isPositive) {
    icon = <TrendingUp className="w-3.5 h-3.5" />;
    if (colorRule === 'TW') {
      textColor = 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50';
    } else {
      textColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50';
    }
  } else if (isNegative) {
    icon = <TrendingDown className="w-3.5 h-3.5" />;
    if (colorRule === 'TW') {
      textColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50';
    } else {
      textColor = 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50';
    }
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-1 font-mono',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1 font-mono',
    lg: 'px-3 py-1.5 text-sm font-bold gap-1.5 font-mono',
  };

  return (
    <span className={`inline-flex items-center rounded-md ${sizeClasses[size]} ${textColor} ${className}`}>
      {showIcon && !isZero && icon}
      {formatPercent(changePercent)}
      {changeAmount !== undefined && (
        <span className="opacity-80 text-[11px] ml-1">
          ({changeAmount > 0 ? '+' : ''}{changeAmount.toFixed(2)})
        </span>
      )}
    </span>
  );
};
