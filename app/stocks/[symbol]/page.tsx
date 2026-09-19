'use client';

import React, { useState, useEffect, use } from 'react';
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

export default function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = use(params);
  const symbolParam = resolvedParams.symbol;

  const { assets, lastTickTime, isInWatchlist, addToWatchlist, removeFromWatchlist, addAlert } = useApp();
  const [stock, setStock] = useState<Stock | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);

  // Alert modal state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [targetAlertPrice, setTargetAlertPrice] = useState<string>('');
  const [alertNote, setAlertNote] = useState<string>('');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const found = await stockApi.getStockBySymbol(symbolParam);
      if (found) {
        setStock(found);
        setTargetAlertPrice(found.price.toString());
        const newsData = await newsApi.getNewsBySymbol(found.symbol);
        setNews(newsData);
      }
      setLoading(false);
    }
    loadData();
  }, [symbolParam]);

  // Sync real-time simulated price updates from context
  const liveStock = assets.find(a => a.symbol.toLowerCase() === symbolParam.toLowerCase()) as Stock || stock;

  if (loading) return <LoadingSkeleton message={`載入 ${symbolParam} 股票行情與詳細資訊中...`} />;
  if (!liveStock) return <ErrorState message={`找不到代號為 ${symbolParam} 的股票資料`} />;

  const inWatchlist = isInWatchlist(liveStock.symbol);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetAlertPrice);
    if (isNaN(val)) return;

    addAlert({
      symbol: liveStock.symbol,
      assetName: liveStock.name,
      category: 'price',
      operator: val < liveStock.price ? 'less_than' : 'greater_than',
      targetValue: val,
      currentValue: liveStock.price,
      enabled: true,
      note: alertNote || '手動建立之客觀價格提醒',
    });

    setShowAlertModal(false);
    setAlertNote('');
  };

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: '總覽' },
    { key: 'chart', label: '即時圖表' },
    { key: 'kline', label: 'K 線與成交量' },
    { key: 'history', label: '歷史資料' },
    { key: 'stats', label: '統計數據' },
    { key: 'financials', label: '財務指標' },
    { key: 'news', label: '相關新聞' },
    { key: 'info', label: '公司基本資料' },
  ];

  return (
    <div className="space-y-6">
      {/* Stock Header Info */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
                {liveStock.name}
              </h1>
              <span className="px-2.5 py-1 text-sm font-bold font-mono rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {liveStock.symbol}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                {liveStock.exchange || liveStock.region}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{liveStock.description}</p>
          </div>

          {/* Price Header */}
          <div className="flex flex-col items-start md:items-end">
            <RealtimeBadge lastUpdated={lastTickTime || liveStock.lastUpdated} className="mb-1" />
            <PriceDisplay
              symbol={liveStock.symbol}
              price={liveStock.price}
              change={liveStock.change}
              changePercent={liveStock.changePercent}
              size="xl"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (inWatchlist) removeFromWatchlist(liveStock.symbol);
              else addToWatchlist(liveStock.symbol);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              inWatchlist
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'
            }`}
          >
            {inWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {inWatchlist ? '已在觀察清單' : '加入觀察清單'}
          </button>

          <button
            onClick={() => setShowAlertModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4 text-purple-500" /> 設定客觀提醒
          </button>

          <Link
            href={`/stocks/compare?symbols=${liveStock.symbol}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-4 h-4 text-indigo-500" /> 數據比較
          </Link>

          <button
            onClick={handleCopyShare}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {copiedShare ? '已複製連結' : '分享頁面'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {(activeTab === 'overview' || activeTab === 'chart') && (
          <div className="space-y-6">
            <AreaTrendChart basePrice={liveStock.price} title={`${liveStock.name} (${liveStock.symbol}) 折線趨勢`} />
          </div>
        )}

        {(activeTab === 'overview' || activeTab === 'kline') && (
          <div className="space-y-6">
            <CandlestickChart symbol={liveStock.symbol} assetName={liveStock.name} basePrice={liveStock.price} />
          </div>
        )}

        {/* Stats & Key Financial Metrics */}
        {(activeTab === 'overview' || activeTab === 'stats' || activeTab === 'financials') && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400">市值 (Market Cap)</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {formatMarketCap(liveStock.metrics?.marketCap)}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400">本益比 (P/E Ratio)</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {liveStock.metrics?.peRatio || '--'}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400">每股盈餘 (EPS)</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                ${liveStock.metrics?.eps || '--'}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400">52 週最高 / 最低</span>
              <div className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                ${liveStock.metrics?.high52w} / ${liveStock.metrics?.low52w}
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {(activeTab === 'overview' || activeTab === 'news') && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {liveStock.name} 相關最新市場新聞
            </h3>
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.map(item => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
                目前沒有與 {liveStock.name} 相關的新聞報導。
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-500" /> 設定 {liveStock.name} 客觀條件提醒
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              本提醒純屬個人客觀價格門檻監測，不含任何投資或下單建議。
            </p>

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  目標觸發價格 (USD / TWD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetAlertPrice}
                  onChange={e => setTargetAlertPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  提醒備註說明 (選填)
                </label>
                <input
                  type="text"
                  value={alertNote}
                  onChange={e => setAlertNote(e.target.value)}
                  placeholder="例如：低於防守點位時觀察..."
                  className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
                >
                  建立提醒
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
