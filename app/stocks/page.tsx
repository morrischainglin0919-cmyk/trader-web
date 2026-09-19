'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Stock } from '@/types/asset';
import { TrendingUp, Layers, Award, Search, Scale } from 'lucide-react';

export default function StockHubPage() {
  const { assets } = useApp();
  const stocks = assets.filter(a => a.category === 'stock') as Stock[];
  const taiwanStocks = stocks.filter(s => s.region === 'TW');
  const usStocks = stocks.filter(s => s.region === 'US');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-red-500" /> 股票市場中心
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            提供台股與美股上市櫃企業財務指標、本益比、EPS 與成交量分析。
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/stocks/taiwan"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 transition-colors"
          >
            台股總覽
          </Link>
          <Link
            href="/stocks/us"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 transition-colors"
          >
            美股總覽
          </Link>
          <Link
            href="/stocks/rankings"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 transition-colors"
          >
            股票排行
          </Link>
          <Link
            href="/stocks/compare"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
          >
            股票數據比較
          </Link>
        </div>
      </div>

      {/* Taiwan Stocks Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" /> 台灣市場經典藍籌 (台股)
          </h2>
          <Link href="/stocks/taiwan" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
            查看更多台股 ({taiwanStocks.length})
          </Link>
        </div>
        <DataTable assets={taiwanStocks} pageSize={10} />
      </section>

      {/* US Stocks Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" /> 美國科技與消費龍頭 (美股)
          </h2>
          <Link href="/stocks/us" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
            查看更多美股 ({usStocks.length})
          </Link>
        </div>
        <DataTable assets={usStocks} pageSize={10} />
      </section>
    </div>
  );
}
