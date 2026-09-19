'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { ForexPair } from '@/types/asset';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { Scale, X, Plus } from 'lucide-react';

export default function ForexComparePage() {
  const { assets } = useApp();
  const pairs = assets.filter(a => a.category === 'forex') as ForexPair[];
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['USD/TWD', 'USD/JPY', 'EUR/USD']);
  const [searchQuery, setSearchQuery] = useState('');

  const selected = pairs.filter(p => selectedSymbols.includes(p.symbol));

  const handleRemove = (sym: string) => setSelectedSymbols(prev => prev.filter(s => s !== sym));
  const handleAdd = (sym: string) => {
    if (selectedSymbols.length >= 5) return;
    if (!selectedSymbols.includes(sym)) setSelectedSymbols(prev => [...prev, sym]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Scale className="w-7 h-7 text-emerald-500" /> 外匯貨幣對走勢比較工具
        </h1>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">已選貨幣對 ({selectedSymbols.length}/5):</span>
          {selected.map(p => (
            <div key={p.symbol} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
              <span>{p.symbol}</span>
              <button onClick={() => handleRemove(p.symbol)}><X className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      <ComparisonChart assets={selected} />
    </div>
  );
}
