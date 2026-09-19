'use client';

import React from 'react';
import Link from 'next/link';
import { MarketSummaryCard } from '@/types/market';
import { ChangeBadge } from '../common/ChangeBadge';
import { formatPrice } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface MarketOverviewCardProps {
  card: MarketSummaryCard;
}

export const MarketOverviewCard: React.FC<MarketOverviewCardProps> = ({ card }) => {
  const getHref = () => {
    switch (card.region) {
      case 'TW':
        return '/markets?region=TW';
      case 'US':
        return '/markets?region=US';
      case 'ASIA':
        return '/markets?region=ASIA';
      case 'EU':
        return '/markets?region=EU';
      default:
        if (card.symbol === 'BTC') return '/crypto';
        if (card.symbol === 'USD/TWD') return '/forex';
        return '/markets';
    }
  };

  return (
    <Link
      href={getHref()}
      className="group block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {card.name}
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">({card.symbol})</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </div>

      <div className="flex items-baseline justify-between font-mono mt-3">
        <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {formatPrice(card.value)}
        </span>
        <ChangeBadge changePercent={card.changePercent} changeAmount={card.change} size="sm" />
      </div>
    </Link>
  );
};
