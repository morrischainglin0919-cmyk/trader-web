'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { AnyAsset } from '@/types/asset';
import { PriceDisplay } from '../common/PriceDisplay';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface AssetCardProps {
  asset: AnyAsset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const inWatchlist = isInWatchlist(asset.symbol);

  const getDetailHref = () => {
    switch (asset.category) {
      case 'stock':
        return `/stocks/${asset.symbol}`;
      case 'etf':
        return `/etf/${asset.symbol}`;
      case 'crypto':
        return `/crypto/${asset.symbol}`;
      case 'forex':
        return `/forex/${asset.symbol.replace('/', '-')}`;
      default:
        return `/search?q=${asset.symbol}`;
    }
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(asset.symbol);
    } else {
      addToWatchlist(asset.symbol);
    }
  };

  return (
    <div className="group relative p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all hover:shadow-md flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 mb-3">
        <Link href={getDetailHref()} className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {asset.name}
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{asset.symbol}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {asset.industry || ('exchange' in asset ? asset.exchange : '') || asset.region}
          </p>
        </Link>

        <button
          onClick={handleWatchlistToggle}
          className={`p-1.5 rounded-lg transition-colors ${
            inWatchlist
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={inWatchlist ? '從觀察清單移除' : '加入觀察清單'}
        >
          {inWatchlist ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <PriceDisplay
          symbol={asset.symbol}
          price={asset.price}
          change={asset.change}
          changePercent={asset.changePercent}
          category={asset.category}
          size="md"
        />
      </div>
    </div>
  );
};
