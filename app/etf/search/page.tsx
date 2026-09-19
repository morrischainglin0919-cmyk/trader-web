'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ETF } from '@/types/asset';
import { Search } from 'lucide-react';

export default function EtfSearchPage() {
  const { assets } = useApp();
  const etfs = assets.filter(a => a.category === 'etf') as ETF[];
  const [query, setQuery] = useState('');

  const filtered = etfs.filter(
    e =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.symbol.toLowerCase().includes(query.toLowerCase()) ||
      (e.issuer && e.issuer.toLowerCase().includes(query.toLowerCase())) ||
      (e.metrics?.underlyingIndex && e.metrics.underlyingIndex.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Search className="w-7 h-7 text-indigo-500" /> ETF 專屬搜尋與發行商過濾
        </h1>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋 ETF 代號、名稱、發行商或追蹤指數（如：0050, SPY, 元大, Vanguard, S&P 500）..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <DataTable assets={filtered} pageSize={15} title={`搜尋結果 (${filtered.length} 檔 ETF)`} />
    </div>
  );
}
