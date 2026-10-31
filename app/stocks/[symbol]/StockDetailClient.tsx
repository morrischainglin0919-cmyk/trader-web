'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { stockApi, newsApi } from '@/lib/api';
import { fetchYahooQuote } from '@/lib/api/yahooFinanceApi';
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
  const [liveSource, setLiveSource] = useState<{ isLive: boolean; source: string; time?: string }>({
    isLive: false,
    source: '即時行情 (模擬備援)'
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else {
        setLoading(true);
        setError(false);
      }

      const [stockData, newsData] = await Promise.all([
        stockApi.getStockBySymbol(symbol),
        newsApi.getNewsByAssetSymbol(symbol),
      ]);

      let finalStock = stockData;

      // Attempt live Yahoo Finance API fetch
      try {
        const yahooQuote = await fetchYahooQuote(symbol, 'stock');
        if (yahooQuote && stockData) {
          finalStock = {
            ...stockData,
            price: yahooQuote.regularMarketPrice,
            change: yahooQuote.regularMarketChange,
            changePercent: yahooQuote.regularMarketChangePercent,
            previousClose: yahooQuote.regularMarketPreviousClose,
            open: yahooQuote.regularMarketOpen || stockData.open,
            high: yahooQuote.regularMarketDayHigh || stockData.high,
            low: yahooQuote.regularMarketDayLow || stockData.low,
            volume: yahooQuote.regularMarketVolume || stockData.volume,
            sparkline: yahooQuote.sparkline || stockData.sparkline,
          };
          setLiveSource({
            isLive: true,
            source: yahooQuote.source,
            time: yahooQuote.timestamp
          });
        }
      } catch (e) {
        // Fallback to stockData seamlessly
      }

      setStock(finalStock || null);
      setRelatedNews(newsData);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [symbol]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const liveStock = stock || (assets.find(a => a.symbol.toLowerCase() === symbol.toLowerCase()) as Stock);

  if (loading) return <LoadingSkeleton message={`連線 Yahoo Finance 載入 ${symbol} 個股資料中...`} />;
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
              <RealtimeBadge
                isRealTime={liveSource.isLive}
                source={liveSource.source}
                lastUpdated={liveSource.time || lastTickTime}
                onRefresh={() => loadData(true)}
                isRefreshing={refreshing}
              />
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
                {inWatchlist ? '已追蹤' : '加入追蹤'}
              </button>

              <Link
                href={`/my-market/alerts?symbol=${liveStock.symbol}`}
                className="p-2 text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="設定價格提醒"
              >
                <Bell className="w-4 h-4" />
              </Link>

              <Link
                href={`/stocks/compare?base=${liveStock.symbol}`}
                className="p-2 text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="與其他個股比較"
              >
                <Scale className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar gap-2">
        {[
          { key: 'overview', label: '總覽與分時走勢' },
          { key: 'kline', label: '專業 K 線圖' },
          { key: 'financials', label: '財務與估值指標' },
          { key: 'news', label: '即時相關新聞' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`px-4 py-2.5 text-xs md:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" /> 分時走勢圖
            </h3>
            <div className="h-80 w-full">
              <AreaTrendChart symbol={liveStock.symbol} basePrice={liveStock.price} />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">成交量</span>
              <p className="text-lg font-bold font-mono mt-1">{formatVolume(liveStock.volume)}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">市值</span>
              <p className="text-lg font-bold font-mono mt-1">{formatMarketCap(liveStock.metrics.marketCap)}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">本益比 (P/E)</span>
              <p className="text-lg font-bold font-mono mt-1">{liveStock.metrics.peRatio || '-'}x</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">現金殖利率</span>
              <p className="text-lg font-bold font-mono mt-1">{liveStock.metrics.dividendYield || '-'}%</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kline' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-brand-500" /> 歷史 K 線與均線分析
          </h3>
          <div className="h-96 w-full">
            <CandlestickChart symbol={liveStock.symbol} basePrice={liveStock.price} />
          </div>
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-500" /> 基本面與評價指標
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            <div>
              <p className="text-xs text-slate-500">每股盈餘 (EPS)</p>
              <p className="text-base font-bold font-mono mt-1">${liveStock.metrics.eps || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">股價淨值比 (P/B)</p>
              <p className="text-base font-bold font-mono mt-1">{liveStock.metrics.pbRatio || '-'}x</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">52 週最高價</p>
              <p className="text-base font-bold font-mono mt-1 text-emerald-600 dark:text-emerald-400">${liveStock.metrics.high52w}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">52 週最低價</p>
              <p className="text-base font-bold font-mono mt-1 text-rose-600 dark:text-rose-400">${liveStock.metrics.low52w}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="space-y-4">
          {relatedNews.length > 0 ? (
            relatedNews.map(item => <NewsCard key={item.id} news={item} />)
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              目前暫無此標的之相關新聞報導
            </div>
          )}
        </div>
      )}
    </div>
  );
}
