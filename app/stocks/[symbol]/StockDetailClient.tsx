'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { stockApi, newsApi } from '@/lib/api';
import { Stock } from '@/types/asset';
import { NewsItem } from '@/types/news';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { RealtimeBadge } from '@/components/common/RealtimeBadge';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { AreaTrendChart } from '@/components/charts/AreaTrendChart';
import { NewsCard } from '@/components/cards/NewsCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { formatVolume, formatMarketCap } from '@/lib/utils';
import {
  Bookmark,
  BookmarkCheck,
  Bell,
  Scale,
  Share2,
  TrendingUp,
  Building,
  BarChart2,
  FileText,
  Calendar,
  Check,
} from 'lucide-react';

type TabKey = 'overview' | 'chart' | 'kline' | 'history' | 'stats' | 'financials' | 'news' | 'info';

export function StockDetailClient({ symbol }: { symbol: string }) {
  const { assets, lastTickTime, isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [stock, setStock] = useState<Stock | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(false);
        const [stockData, newsData] = await Promise.all([
          stockApi.getStockBySymbol(symbol),
          newsApi.getNewsByAssetSymbol(symbol),
        ]);
        setStock(stockData || null);
        setRelatedNews(newsData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol]);

  const liveStock = (assets.find(a => a.symbol.toLowerCase() === symbol.toLowerCase()) as Stock) || stock;

  if (loading) return <LoadingSkeleton message={`載入 ${symbol} 個股資料中...`} />;
  if (error || !liveStock) return <ErrorState message={`找不到代號或名稱為 ${symbol} 的股票`} />;

  const inWatchlist = isInWatchlist(liveStock.symbol);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(liveStock.symbol);
    } else {
      addToWatchlist(liveStock.symbol);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stock Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-black rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                {liveStock.exchange}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                {liveStock.industry}
              </span>
              <RealtimeBadge lastUpdated={lastTickTime} />
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {liveStock.name}
              </h1>
              <span className="text-lg md:text-xl font-bold font-mono text-slate-500 dark:text-slate-400">
                {liveStock.symbol}
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {liveStock.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
            <PriceDisplay
              price={liveStock.price}
              change={liveStock.change}
              changePercent={liveStock.changePercent}
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

              <Link
                href="/stocks/compare"
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Scale className="w-4 h-4" /> 數據比較
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <AreaTrendChart basePrice={liveStock.previousClose} title={`${liveStock.name} (${liveStock.symbol}) 今日走勢`} height="320px" />
      </div>

      {/* Technical Candlestick Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <CandlestickChart title={`${liveStock.name} K 線圖 (日K)`} height="400px" />
      </div>

      {/* Financial Metrics Cards */}
      {liveStock.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">市值 (Market Cap)</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {formatMarketCap(liveStock.metrics.marketCap)}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">本益比 (P/E Ratio)</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {liveStock.metrics.peRatio} x
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">每股盈餘 (EPS)</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              ${liveStock.metrics.eps}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">股利殖利率 (Yield)</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {liveStock.metrics.dividendYield}%
            </div>
          </div>
        </div>
      )}

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {liveStock.name} 相關個股新聞
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedNews.map(item => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
