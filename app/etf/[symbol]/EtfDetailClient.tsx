'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { etfApi } from '@/lib/api';
import { fetchYahooQuote } from '@/lib/api/yahooFinanceApi';
import { ETF } from '@/types/asset';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { RealtimeBadge } from '@/components/common/RealtimeBadge';
import { AreaTrendChart } from '@/components/charts/AreaTrendChart';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { formatMarketCap } from '@/lib/utils';
import { Bookmark, BookmarkCheck, PieChart, ShieldCheck } from 'lucide-react';

export function EtfDetailClient({ symbol }: { symbol?: string }) {
  const routeParams = useParams();
  const rawSymbol = symbol || (routeParams?.symbol as string) || '';
  const currentSymbol = decodeURIComponent(rawSymbol).trim();

  const { assets, lastTickTime, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [etf, setEtf] = useState<ETF | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveSource, setLiveSource] = useState<{ isLive: boolean; source: string; time?: string }>({
    isLive: false,
    source: '即時行情 (模擬備援)'
  });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (!currentSymbol) return;
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await etfApi.getEtfBySymbol(currentSymbol);
      if (data) {
        setEtf(data);
        setLoading(false);
      }

      try {
        const quote = await fetchYahooQuote(currentSymbol, 'etf');
        if (quote && data) {
          setEtf(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              price: quote.regularMarketPrice,
              change: quote.regularMarketChange,
              changePercent: quote.regularMarketChangePercent,
              previousClose: quote.regularMarketPreviousClose,
              open: quote.regularMarketOpen || prev.open,
              high: quote.regularMarketDayHigh || prev.high,
              low: quote.regularMarketDayLow || prev.low,
              volume: quote.regularMarketVolume || prev.volume,
              sparkline: quote.sparkline || prev.sparkline,
            };
          });
          setLiveSource({
            isLive: true,
            source: quote.source,
            time: quote.timestamp
          });
        }
      } catch (e) {
        // Fallback gracefully
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentSymbol]);

  useEffect(() => {
    load();
  }, [load]);

  const liveEtf = etf || (assets && assets.find(a => a.symbol.toLowerCase() === currentSymbol.toLowerCase()) as ETF);

  if (loading && !liveEtf) return <LoadingSkeleton message={`載入 ${currentSymbol || 'ETF'} 資料中...`} />;
  if (!liveEtf) return <ErrorState message={`找不到代號為 ${currentSymbol} 的 ETF`} />;

  const inWatchlist = isInWatchlist(liveEtf.symbol);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(liveEtf.symbol);
    } else {
      addToWatchlist(liveEtf.symbol);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-black rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                {liveEtf.exchange}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                {liveEtf.issuer}
              </span>
              <RealtimeBadge
                isRealTime={liveSource.isLive}
                source={liveSource.source}
                lastUpdated={liveSource.time || lastTickTime}
                onRefresh={() => load(true)}
                isRefreshing={refreshing}
              />
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {liveEtf.name}
              </h1>
              <span className="text-lg md:text-xl font-bold font-mono text-slate-500 dark:text-slate-400">
                {liveEtf.symbol}
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {liveEtf.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
            <PriceDisplay
              price={liveEtf.price}
              change={liveEtf.change}
              changePercent={liveEtf.changePercent}
              size="lg"
            />

            <button
              onClick={toggleWatchlist}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                inWatchlist
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {inWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {inWatchlist ? '已追蹤' : '加入追蹤'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-500" /> 分時走勢圖
            </h3>
            <div className="h-80 w-full">
              <AreaTrendChart symbol={liveEtf.symbol} basePrice={liveEtf.price} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> ETF 重要數據
            </h3>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">資產規模 (AUM)</span>
                <span className="font-bold font-mono">{formatMarketCap(liveEtf.metrics.aum)}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">經理費率</span>
                <span className="font-bold font-mono">{liveEtf.metrics.expenseRatio}%</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">預估殖利率</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{liveEtf.metrics.dividendYield}%</span>
              </div>
              <div className="flex justify-between text-xs py-1.5">
                <span className="text-slate-500">追蹤指數</span>
                <span className="font-bold text-right truncate max-w-[160px]">{liveEtf.metrics.underlyingIndex}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
