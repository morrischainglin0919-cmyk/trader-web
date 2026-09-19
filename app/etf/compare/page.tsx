'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { ETF } from '@/types/asset';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { formatMarketCap, formatVolume } from '@/lib/utils';
import { Scale, X, Plus } from 'lucide-react';

export default function EtfComparePage() {
  const { assets } = useApp();
  const etfs = assets.filter(a => a.category === 'etf') as ETF[];

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['0050', '00878', 'SPY']);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEtfs = etfs.filter(e => selectedSymbols.includes(e.symbol));

  const handleRemove = (sym: string) => {
    setSelectedSymbols(prev => prev.filter(s => s !== sym));
  };

  const handleAdd = (sym: string) => {
    if (selectedSymbols.length >= 5) return;
    if (!selectedSymbols.includes(sym)) {
      setSelectedSymbols(prev => [...prev, sym]);
    }
    setSearchQuery('');
  };

  const suggestions = etfs.filter(
    e =>
      !selectedSymbols.includes(e.symbol) &&
      (e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Scale className="w-7 h-7 text-indigo-500" /> ETF 數據與費率比較工具
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          對比資產規模 (AUM)、總內扣費用 (Expense Ratio)、追蹤指數與配息頻率。
        </p>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">已選 ETF ({selectedSymbols.length}/5):</span>
          {selectedEtfs.map(e => (
            <div
              key={e.symbol}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs font-mono"
            >
              <span>{e.name} ({e.symbol})</span>
              <button onClick={() => handleRemove(e.symbol)} className="hover:text-red-500 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {selectedSymbols.length < 5 && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="+ 新增比較 ETF..."
                className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {searchQuery && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1">
                  {suggestions.map(s => (
                    <button
                      key={s.symbol}
                      onClick={() => handleAdd(s.symbol)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold">{s.name} ({s.symbol})</span>
                      <Plus className="w-3.5 h-3.5 text-indigo-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ComparisonChart assets={selectedEtfs} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
              <th className="py-3 px-4">比較指標項</th>
              {selectedEtfs.map(e => (
                <th key={e.symbol} className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                  {e.name} ({e.symbol})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">目前價格</td>
              {selectedEtfs.map(e => (
                <td key={e.symbol} className="py-3 px-4 text-right">
                  <PriceDisplay symbol={e.symbol} price={e.price} change={e.change} changePercent={e.changePercent} size="sm" />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">發行機構 / 經理公司</td>
              {selectedEtfs.map(e => (
                <td key={e.symbol} className="py-3 px-4 text-right font-sans font-medium">{e.issuer}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">資產規模 (AUM)</td>
              {selectedEtfs.map(e => (
                <td key={e.symbol} className="py-3 px-4 text-right font-bold">{formatMarketCap(e.metrics?.aum)}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">內扣總費用率 (%)</td>
              {selectedEtfs.map(e => (
                <td key={e.symbol} className="py-3 px-4 text-right font-bold text-brand-600 dark:text-brand-400">{e.metrics?.expenseRatio}%</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">預估年殖利率 (%)</td>
              {selectedEtfs.map(e => (
                <td key={e.symbol} className="py-3 px-4 text-right font-bold text-red-500">{e.metrics?.dividendYield}%</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">追蹤指數名稱</td>
              {selectedEtfs.map(e => (
                <td key={e.symbol} className="py-3 px-4 text-right font-sans">{e.metrics?.underlyingIndex || '--'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
