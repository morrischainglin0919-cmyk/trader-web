'use client';

import React, { useState, useEffect, use } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { forexApi } from '@/lib/api';
import { ForexPair } from '@/types/asset';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { RealtimeBadge } from '@/components/common/RealtimeBadge';
import { AreaTrendChart } from '@/components/charts/AreaTrendChart';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export default function ForexDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = use(params);
  const rawSymbol = resolvedParams.symbol.replace('-', '/');

  const { assets, lastTickTime, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [forex, setForex] = useState<ForexPair | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await forexApi.getForexBySymbol(rawSymbol);
      setForex(data || null);
      setLoading(false);
    }
    load();
  }, [rawSymbol]);

  const liveForex = (assets.find(a => a.symbol.toLowerCase() === rawSymbol.toLowerCase()) as ForexPair) || forex;

  if (loading) return <LoadingSkeleton message={`載入 ${rawSymbol} 匯率資訊中...`} />;
  if (!liveForex) return <ErrorState message={`找不到貨幣對 ${rawSymbol}`} />;

  const inWatchlist = isInWatchlist(liveForex.symbol);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
                {liveForex.name}
              </h1>
              <span className="px-2.5 py-1 text-sm font-bold font-mono rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                {liveForex.symbol}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{liveForex.description}</p>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <RealtimeBadge lastUpdated={lastTickTime} className="mb-1" />
            <PriceDisplay
              symbol={liveForex.symbol}
              price={liveForex.price}
              change={liveForex.change}
              changePercent={liveForex.changePercent}
              category="forex"
              size="xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (inWatchlist) removeFromWatchlist(liveForex.symbol);
              else addToWatchlist(liveForex.symbol);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              inWatchlist ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {inWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {inWatchlist ? '已在觀察清單' : '加入觀察清單'}
          </button>
        </div>
      </div>

      <AreaTrendChart basePrice={liveForex.price} title={`${liveForex.name} (${liveForex.symbol}) 匯率趨勢`} />
      <CandlestickChart symbol={liveForex.symbol} assetName={liveForex.name} basePrice={liveForex.price} />
    </div>
  );
}
