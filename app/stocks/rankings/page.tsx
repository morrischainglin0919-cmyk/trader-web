'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Stock } from '@/types/asset';
import { Award, TrendingUp, TrendingDown, Zap } from 'lucide-react';

export default function StockRankingsPage() {
  const { assets } = useApp();
  const stocks = assets.filter(a => a.category === 'stock') as Stock[];
  const [tab, setTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');

  const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent);
  const volume = [...stocks].sort((a, b) => b.volume - a.volume);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-500" /> 全球股票動態排行榜
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            即時彙整全球股票強勢漲幅榜、弱勢跌幅榜與暴量熱門標的。
          </p>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setTab('gainers')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'gainers'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🔥 漲幅排行
          </button>
          <button
            onClick={() => setTab('losers')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'losers'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            📉 跌幅排行
          </button>
          <button
            onClick={() => setTab('volume')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'volume'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ⚡ 成交量排行
          </button>
        </div>
      </div>

      <DataTable
        assets={tab === 'gainers' ? gainers : tab === 'losers' ? losers : volume}
        pageSize={15}
        showCategory={true}
      />
    </div>
  );
}
