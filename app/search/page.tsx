'use client';

import React, { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { searchAssets } from '@/data';
import { AnyAsset, AssetCategory } from '@/types/asset';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { Search } from 'lucide-react';

export default function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const qParam = resolvedParams.q || '';

  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'all'>('all');
  const [results, setResults] = useState<AnyAsset[]>([]);

  useEffect(() => {
    if (qParam.trim()) {
      const found = searchAssets(qParam);
      setResults(found);
    } else {
      setResults([]);
    }
  }, [qParam]);

  const filteredResults =
    categoryFilter === 'all'
      ? results
      : results.filter(r => r.category === categoryFilter);

  const categories: { key: AssetCategory | 'all'; label: string }[] = [
    { key: 'all', label: `全部 (${results.length})` },
    { key: 'stock', label: `股票 (${results.filter(r => r.category === 'stock').length})` },
    { key: 'etf', label: `ETF (${results.filter(r => r.category === 'etf').length})` },
    { key: 'crypto', label: `加密貨幣 (${results.filter(r => r.category === 'crypto').length})` },
    { key: 'forex', label: `外匯 (${results.filter(r => r.category === 'forex').length})` },
    { key: 'index', label: `指數 (${results.filter(r => r.category === 'index').length})` },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Search className="w-7 h-7 text-brand-500" /> 全站標的搜尋結果
        </h1>
        {qParam && (
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            關聯關鍵字「<span className="font-bold text-slate-900 dark:text-slate-100">{qParam}</span>」的搜尋結果。
          </p>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              categoryFilter === cat.key
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredResults.length > 0 ? (
        <DataTable assets={filteredResults} pageSize={15} showCategory={true} />
      ) : (
        <EmptyState
          title={`找不到與「${qParam}」相關的標的`}
          description="請確認代號或名稱拼寫是否正確，例如：2330, 台積電, NVDA, 0050, BTC, USD/TWD。"
        />
      )}
    </div>
  );
}
