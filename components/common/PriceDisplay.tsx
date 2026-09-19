'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { ChangeBadge } from './ChangeBadge';

interface PriceDisplayProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  symbol,
  price,
  change,
  changePercent,
  category,
  size = 'md',
  showBadge = true,
}) => {
  const { recentlyTickedSymbols, colorRule } = useApp();
  const tickState = recentlyTickedSymbols[symbol];

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-3xl font-black',
  };

  let flashBg = '';
  if (tickState === 'up') {
    flashBg = colorRule === 'TW' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500';
  } else if (tickState === 'down') {
    flashBg = colorRule === 'TW' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500';
  }

  return (
    <div className="inline-flex items-center gap-2 font-mono">
      <span
        className={`transition-colors duration-500 px-1 py-0.5 rounded ${sizeClasses[size]} ${flashBg}`}
      >
        {formatPrice(price, category)}
      </span>
      {showBadge && (
        <ChangeBadge changePercent={changePercent} changeAmount={change} size={size === 'xl' ? 'lg' : size === 'lg' ? 'md' : 'sm'} />
      )}
    </div>
  );
};
