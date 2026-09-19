'use client';

import React, { useState, useEffect, use } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { etfApi } from '@/lib/api';
import { ETF } from '@/types/asset';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { RealtimeBadge } from '@/components/common/RealtimeBadge';
import { AreaTrendChart } from '@/components/charts/AreaTrendChart';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { formatMarketCap, formatVolume } from '@/lib/utils';
import { Bookmark, BookmarkCheck, Bell, Scale, PieChart, ShieldCheck } from 'lucide-react';

export default function EtfDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = use(params);
  const symbolParam = resolvedParams.symbol;

  const { assets, lastTickTime, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [etf, setEtf] = useState<ETF | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await etfApi.getEtfBySymbol(symbolParam);
      setEtf(data || null);
      setLoading(false);
    }
    load();
  }, [symbolParam]);

  const liveEtf = (assets.find(a => a.symbol.toLowerCase() === symbolParam.toLowerCase()) as ETF) || etf;

  if (loading) return <LoadingSkeleton message={`載入 ${symbolParam} ETF 資料中...`} />;
  if (!liveEtf) return <ErrorState message={`找不到代號為 ${symbolParam} 的 ETF` } />;

  const inWatchlist = isInWatchlist(liveEtf.symbol);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
                {liveEtf.name}
              </h1>
              <span className="px-2.5 py-1 text-sm font-bold font-mono rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {liveEtf.symbol}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {liveEtf.issuer}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{liveEtf.description}</p>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <RealtimeBadge lastUpdated={lastTickTime} className="mb-1" />
            <PriceDisplay
              symbol={liveEtf.symbol}
              price={liveEtf.price}
              change={liveEtf.change}
              changePercent={liveEtf.changePercent}
              size="xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (inWatchlist) removeFromWatchlist(liveEtf.symbol);
              else addToWatchlist(liveEtf.symbol);
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">資產規模 (AUM)</span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatMarketCap(liveEtf.metrics?.aum)}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">經理費用率</span>
          <div className="text-lg font-bold font-mono text-brand-600 dark:text-brand-400 mt-1">
            {liveEtf.metrics?.expenseRatio}%
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">殖利率 (Est.)</span>
          <div className="text-lg font-bold font-mono text-red-500 mt-1">
            {liveEtf.metrics?.dividendYield}%
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">追蹤指數</span>
          <div className="text-xs font-bold font-sans text-slate-900 dark:text-slate-100 mt-1 truncate">
            {liveEtf.metrics?.underlyingIndex}
          </div>
        </div>
      </div>

      <AreaTrendChart basePrice={liveEtf.price} title={`${liveEtf.name} (${liveEtf.symbol}) 行情趨勢`} />
      <CandlestickChart symbol={liveEtf.symbol} assetName={liveEtf.name} basePrice={liveEtf.price} />
    </div>
  );
}
