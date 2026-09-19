'use client';

import React, { useState, useEffect, use } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { cryptoApi } from '@/lib/api';
import { CryptoAsset } from '@/types/asset';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { RealtimeBadge } from '@/components/common/RealtimeBadge';
import { AreaTrendChart } from '@/components/charts/AreaTrendChart';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { formatMarketCap, formatVolume } from '@/lib/utils';
import { Bookmark, BookmarkCheck, Bell, Scale, Coins, Clock } from 'lucide-react';

export default function CryptoDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = use(params);
  const symbolParam = resolvedParams.symbol;

  const { assets, lastTickTime, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [crypto, setCrypto] = useState<CryptoAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await cryptoApi.getCryptoBySymbol(symbolParam);
      setCrypto(data || null);
      setLoading(false);
    }
    load();
  }, [symbolParam]);

  const liveCrypto = (assets.find(a => a.symbol.toLowerCase() === symbolParam.toLowerCase()) as CryptoAsset) || crypto;

  if (loading) return <LoadingSkeleton message={`載入 ${symbolParam} 加密貨幣 24H 行情中...`} />;
  if (!liveCrypto) return <ErrorState message={`找不到代號為 ${symbolParam} 的加密貨幣`} />;

  const inWatchlist = isInWatchlist(liveCrypto.symbol);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
                {liveCrypto.name}
              </h1>
              <span className="px-2.5 py-1 text-sm font-bold font-mono rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                {liveCrypto.symbol}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Rank #{liveCrypto.rank}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{liveCrypto.description}</p>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <RealtimeBadge lastUpdated={lastTickTime} className="mb-1" />
            <PriceDisplay
              symbol={liveCrypto.symbol}
              price={liveCrypto.price}
              change={liveCrypto.change}
              changePercent={liveCrypto.changePercent}
              category="crypto"
              size="xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (inWatchlist) removeFromWatchlist(liveCrypto.symbol);
              else addToWatchlist(liveCrypto.symbol);
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

      {/* 24H Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">24H 最高價</span>
          <div className="text-lg font-bold font-mono text-red-500 mt-1">
            ${liveCrypto.metrics?.high24h || liveCrypto.high}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">24H 最低價</span>
          <div className="text-lg font-bold font-mono text-emerald-500 mt-1">
            ${liveCrypto.metrics?.low24h || liveCrypto.low}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">24H 成交量</span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatVolume(liveCrypto.volume)}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">全網總市值</span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatMarketCap(liveCrypto.metrics?.marketCap)}
          </div>
        </div>
      </div>

      <AreaTrendChart basePrice={liveCrypto.price} title={`${liveCrypto.name} (${liveCrypto.symbol}) 24H 價格走勢`} />
      <CandlestickChart symbol={liveCrypto.symbol} assetName={liveCrypto.name} basePrice={liveCrypto.price} />
    </div>
  );
}
