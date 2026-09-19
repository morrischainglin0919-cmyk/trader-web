'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { CryptoAsset } from '@/types/asset';
import { Search } from 'lucide-react';

export default function CryptoSearchPage() {
  const { assets } = useApp();
  const cryptos = assets.filter(a => a.category === 'crypto') as CryptoAsset[];
  const [query, setQuery] = useState('');

  const filtered = cryptos.filter(
    c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase()) ||
      (c.nameEn && c.nameEn.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Search className="w-7 h-7 text-amber-500" /> 加密貨幣幣種搜尋
        </h1>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋幣種名稱或代號（如：BTC, ETH, SOL, 比特幣, Solana）..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
        </div>
      </div>

      <DataTable assets={filtered} pageSize={15} title={`搜尋結果 (${filtered.length} 個幣種)`} />
    </div>
  );
}
