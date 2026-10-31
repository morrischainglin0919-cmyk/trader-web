'use client';

import React, { useState, useEffect } from 'react';
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

export function CryptoDetailClient({ symbol }: { symbol: string }) {
  const { assets, lastTickTime, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [crypto, setCrypto] = useState<CryptoAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await cryptoApi.getCryptoBySymbol(symbol);
      setCrypto(data || null);
      setLoading(false);
    }
    load();
  }, [symbol]);

  const liveCrypto = (assets.find(a => a.symbol.toLowerCase() === symbol.toLowerCase()) as CryptoAsset) || crypto;

  if (loading) return <LoadingSkeleton message={`載入 ${symbol} 加密貨幣資料中...`} />;
  if (!liveCrypto) return <ErrorState message={`找不到代號為 ${symbol} 的加密貨幣`} />;

  const inWatchlist = isInWatchlist(liveCrypto.symbol);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(liveCrypto.symbol);
    } else {
      addToWatchlist(liveCrypto.symbol);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-black rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                24H 全球市場
              </span>
              <RealtimeBadge lastUpdated={lastTickTime} />
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {liveCrypto.name}
              </h1>
              <span className="text-lg md:text-xl font-bold font-mono text-slate-500 dark:text-slate-400">
                {liveCrypto.symbol}
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {liveCrypto.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
            <PriceDisplay
              price={liveCrypto.price}
              change={liveCrypto.change}
              changePercent={liveCrypto.changePercent}
              size="lg"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={toggleWatchlist}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  inWatchlist
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {inWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {inWatchlist ? '已加入觀察' : '加入觀察'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <AreaTrendChart basePrice={liveCrypto.previousClose} title={`${liveCrypto.name} (${liveCrypto.symbol}) 24H 走勢`} height="320px" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <CandlestickChart title={`${liveCrypto.name} 技術 K 線圖`} height="380px" />
      </div>
    </div>
  );
}
