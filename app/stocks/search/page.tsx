'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Stock } from '@/types/asset';
import { Search, Filter } from 'lucide-react';

export default function StockSearchPage() {
  const { assets } = useApp();
  const stocks = assets.filter(a => a.category === 'stock') as Stock[];

  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'TW' | 'US'>('ALL');

  const filtered = stocks.filter(s => {
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      (s.nameEn && s.nameEn.toLowerCase().includes(query.toLowerCase()));

    const matchesRegion = regionFilter === 'ALL' || s.region === regionFilter;

    return matchesQuery && matchesRegion;
  });

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Search className="w-7 h-7 text-brand-500" /> 股票進階搜尋與篩選
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          支援台股與美股代號、名稱、英文名稱精準比對與市場區分。
        </p>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="輸入股票名稱或代號（如：2330, NVDA, 台積電, Apple）..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">市場地區:</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(['ALL', 'TW', 'US'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    regionFilter === r
                      ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {r === 'ALL' ? '全部' : r === 'TW' ? '台股' : '美股'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DataTable assets={filtered} pageSize={15} title={`搜尋結果 (${filtered.length} 筆標的)`} />
    </div>
  );
}
