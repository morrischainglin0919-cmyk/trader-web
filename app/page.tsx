'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { marketApi, newsApi } from '@/lib/api';
import { MarketRankings, MarketSummaryCard } from '@/types/market';
import { NewsItem } from '@/types/news';
import { RealtimeBadge } from '@/components/common/RealtimeBadge';
import { MarketOverviewCard } from '@/components/cards/MarketOverviewCard';
import { AreaTrendChart } from '@/components/charts/AreaTrendChart';
import { DataTable } from '@/components/common/DataTable';
import { NewsCard } from '@/components/cards/NewsCard';
import { AssetCard } from '@/components/cards/AssetCard';
import { AlertCard } from '@/components/cards/AlertCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import {
  Globe,
  TrendingUp,
  Newspaper,
  Bookmark,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { assets, lastTickTime, watchlists, activeWatchlistId, alerts } = useApp();
  const [overviewCards, setOverviewCards] = useState<MarketSummaryCard[]>([]);
  const [rankings, setRankings] = useState<MarketRankings | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [rankingTab, setRankingTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [cardsData, rankData, newsData] = await Promise.all([
        marketApi.getMarketOverviewCards(),
        marketApi.getMarketRankings(),
        newsApi.getNews('all'),
      ]);
      setOverviewCards(cardsData);
      setRankings(rankData);
      setNews(newsData.slice(0, 4));
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton message="載入全球金融市場 Dashboard 中..." />;
  if (error) return <ErrorState onRetry={fetchData} />;

  // Get assets for current active watchlist
  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];
  const watchlistAssets = assets.filter(a => activeWatchlist.symbols.includes(a.symbol));
  const activeAlerts = alerts.filter(a => a.enabled);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              全球金融市場概覽
            </h1>
            <RealtimeBadge lastUpdated={lastTickTime} />
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            全方位追蹤台股、美股、ETF、加密貨幣與外匯數據與技術指標。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/simulator"
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> 歷史情境模擬器
          </Link>
        </div>
      </div>

      {/* 1. Global Market Overview Summary Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-500" /> 全球市場
          </h2>
          <Link
            href="/markets"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            查看全部市場 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {overviewCards.map(card => (
            <MarketOverviewCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* 2. ECharts Market Trend Chart */}
      <section className="space-y-3">
        <AreaTrendChart basePrice={22420.5} title="台灣加權指數 (TAIEX) 市場即時趨勢" height="360px" />
      </section>

      {/* 3. Market Rankings Table */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" /> 市場動態排行榜
          </h2>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setRankingTab('gainers')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                rankingTab === 'gainers'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🔥 漲幅排行
            </button>
            <button
              onClick={() => setRankingTab('losers')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                rankingTab === 'losers'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📉 跌幅排行
            </button>
            <button
              onClick={() => setRankingTab('volume')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                rankingTab === 'volume'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ⚡ 成交量排行
            </button>
          </div>
        </div>

        {rankings && (
          <DataTable
            assets={
              rankingTab === 'gainers'
                ? rankings.gainers
                : rankingTab === 'losers'
                ? rankings.losers
                : rankings.mostActive
            }
            pageSize={6}
            showCategory={true}
          />
        )}
      </section>

      {/* 4. Latest Market News */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-indigo-500" /> 最新市場新聞
          </h2>
          <Link
            href="/news"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            看更多新聞 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {news.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </section>

      {/* 5. User Watchlist Summary */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" /> 我的觀察清單 ({activeWatchlist.name})
          </h2>
          <Link
            href="/my-market/watchlist"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            管理清單 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {watchlistAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {watchlistAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
            目前觀察清單尚無資產，可在搜尋或市場列表點擊書籤圖示加入。
          </div>
        )}
      </section>

      {/* 6. Active Market Alerts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-500" /> 啟用中的市場提醒 ({activeAlerts.length})
          </h2>
          <Link
            href="/my-market/alerts"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            新增提醒 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
            目前沒有啟用中的客觀條件提醒。
          </div>
        )}
      </section>
    </div>
  );
}
