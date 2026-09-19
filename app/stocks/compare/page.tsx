'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Stock, AnyAsset } from '@/types/asset';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { formatVolume, formatMarketCap } from '@/lib/utils';
import { Scale, Plus, X, Info } from 'lucide-react';

export default function StockComparePage() {
  const { assets } = useApp();
  const stocks = assets.filter(a => a.category === 'stock') as Stock[];

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['NVDA', 'AMD', 'AAPL']);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedAssets = stocks.filter(s => selectedSymbols.includes(s.symbol));

  const handleAddSymbol = (symbol: string) => {
    if (selectedSymbols.length >= 5) return;
    if (!selectedSymbols.includes(symbol)) {
      setSelectedSymbols(prev => [...prev, symbol]);
    }
    setSearchQuery('');
  };

  const handleRemoveSymbol = (symbol: string) => {
    setSelectedSymbols(prev => prev.filter(s => s !== symbol));
  };

  const availableSuggestions = stocks.filter(
    s =>
      !selectedSymbols.includes(s.symbol) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Scale className="w-7 h-7 text-indigo-500" /> 股票客觀數據比較工具
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          最多選擇 5 支股票，對比價格、漲跌幅、成交量、市值、52週高低與波動率。
        </p>
      </div>

      {/* Asset Selection Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">已選股票 ({selectedSymbols.length}/5):</span>
          {selectedAssets.map(asset => (
            <div
              key={asset.symbol}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-bold text-xs font-mono"
            >
              <span>{asset.name} ({asset.symbol})</span>
              <button
                onClick={() => handleRemoveSymbol(asset.symbol)}
                className="hover:text-red-500 transition-colors"
              >
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
                placeholder="+ 新增比較股票..."
                className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />

              {searchQuery && availableSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1">
                  {availableSuggestions.map(s => (
                    <button
                      key={s.symbol}
                      onClick={() => handleAddSymbol(s.symbol)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold">{s.name} ({s.symbol})</span>
                      <Plus className="w-3.5 h-3.5 text-brand-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison ECharts Trend */}
      <ComparisonChart assets={selectedAssets} />

      {/* Objective Data Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
              <th className="py-3 px-4">比較指標項</th>
              {selectedAssets.map(a => (
                <th key={a.symbol} className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                  {a.name} ({a.symbol})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">目前價格</td>
              {selectedAssets.map(a => (
                <td key={a.symbol} className="py-3 px-4 text-right">
                  <PriceDisplay symbol={a.symbol} price={a.price} change={a.change} changePercent={a.changePercent} size="sm" />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">成交量</td>
              {selectedAssets.map(a => (
                <td key={a.symbol} className="py-3 px-4 text-right font-bold">{formatVolume(a.volume)}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">市值 (Market Cap)</td>
              {selectedAssets.map(a => (
                <td key={a.symbol} className="py-3 px-4 text-right">{formatMarketCap(a.metrics?.marketCap)}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">本益比 (P/E Ratio)</td>
              {selectedAssets.map(a => (
                <td key={a.symbol} className="py-3 px-4 text-right">{a.metrics?.peRatio || '--'}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">每股盈餘 (EPS)</td>
              {selectedAssets.map(a => (
                <td key={a.symbol} className="py-3 px-4 text-right">${a.metrics?.eps || '--'}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">52 週最高 / 最低</td>
              {selectedAssets.map(a => (
                <td key={a.symbol} className="py-3 px-4 text-right">
                  ${a.metrics?.high52w} / ${a.metrics?.low52w}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-semibold text-slate-700 dark:text-slate-300">52 週波動率 (%)</td>
              {selectedAssets.map(a => (
                <td key={a.symbol} className="py-3 px-4 text-right">{a.metrics?.volatility52w}%</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 shrink-0 text-brand-500" />
        <span>本比較表僅陳列客觀財務與行情統計數據，無任何推薦或評比傾向。</span>
      </div>
    </div>
  );
}
