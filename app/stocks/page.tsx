'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Stock } from '@/types/asset';
import { TrendingUp, Layers, Award, Globe, Search, Filter, Sparkles } from 'lucide-react';

type RegionTab = 'all' | 'TW' | 'US' | 'ASIA' | 'EU';

export default function StockHubPage() {
  const { assets } = useApp();
  const stocks = assets.filter(a => a.category === 'stock') as Stock[];
  const [selectedRegion, setSelectedRegion] = useState<RegionTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const filteredStocks = stocks.filter(s => {
    const matchesRegion = selectedRegion === 'all' || s.region === selectedRegion;
    const matchesQuery = searchQuery === '' || 
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameEn && s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'all' || s.industry === selectedIndustry;
    return matchesRegion && matchesQuery && matchesIndustry;
  });

  const industries = Array.from(new Set(stocks.map(s => s.industry))).filter(Boolean);

  const regionCounts = {
    all: stocks.length,
    TW: stocks.filter(s => s.region === 'TW').length,
    US: stocks.filter(s => s.region === 'US').length,
    ASIA: stocks.filter(s => s.region === 'ASIA').length,
    EU: stocks.filter(s => s.region === 'EU').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-8 h-8 text-brand-500" /> 全球股票市場大典
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            即時追蹤全球主要股市（台股、美股、日股、韓股、港陸股、歐股）權值指標與財務數據。
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/stocks/rankings"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 transition-colors"
          >
            🏆 漲跌幅排行榜
          </Link>
          <Link
            href="/stocks/compare"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
          >
            ⚖️ 跨國股票數據比較
          </Link>
        </div>
      </div>

      {/* Market Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🇹🇼 台灣股市 (TWSE)</div>
          <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {regionCounts.TW} 支經典標的
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">台積電 / 聯發科 / 鴻海</div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🇺🇸 美國股市 (NYSE/NASDAQ)</div>
          <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {regionCounts.US} 支巨擘標的
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">NVDA / AAPL / MSFT</div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🇯🇵🇰🇷🇭🇰 亞洲市場 (TSE/KRX/HKEX)</div>
          <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {regionCounts.ASIA} 支龍頭標的
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">豐田 / 三星 / 騰訊</div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🇪🇺 歐洲市場 (Euronext/DAX)</div>
          <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {regionCounts.EU} 支指標標的
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">ASML / SAP / 諾和諾德</div>
        </div>
      </div>

      {/* Region Tabs & Filters */}
      <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Region Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedRegion === 'all'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              🌐 全部全球個股 ({regionCounts.all})
            </button>
            <button
              onClick={() => setSelectedRegion('TW')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedRegion === 'TW'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              🇹🇼 台灣市場 ({regionCounts.TW})
            </button>
            <button
              onClick={() => setSelectedRegion('US')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedRegion === 'US'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              🇺🇸 美國股市 ({regionCounts.US})
            </button>
            <button
              onClick={() => setSelectedRegion('ASIA')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedRegion === 'ASIA'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              🌏 亞洲主要市場 ({regionCounts.ASIA})
            </button>
            <button
              onClick={() => setSelectedRegion('EU')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedRegion === 'EU'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              🇪🇺 歐洲市場 ({regionCounts.EU})
            </button>
          </div>

          {/* Quick Search & Industry Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋股票名稱或代碼..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <select
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">所有產業類別</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> 全球個股即時數據列表 ({filteredStocks.length})
          </h2>
        </div>
        <DataTable assets={filteredStocks} pageSize={15} />
      </section>
    </div>
  );
}
