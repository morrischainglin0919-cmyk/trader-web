'use client';

import React, { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { marketApi } from '@/lib/api';
import { MarketIndex } from '@/types/asset';
import { MarketRegion } from '@/types/asset';
import { DataTable } from '@/components/common/DataTable';
import { AreaTrendChart } from '@/components/charts/AreaTrendChart';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Globe, Flag } from 'lucide-react';

export default function MarketsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const regionParam = (resolvedParams?.region as MarketRegion) || 'GLOBAL';

  const { assets } = useApp();
  const [activeRegion, setActiveRegion] = useState<MarketRegion>(regionParam);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resolvedParams?.region) {
      setActiveRegion(resolvedParams.region as MarketRegion);
    }
  }, [resolvedParams]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await marketApi.getMarketIndices();
      setIndices(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSkeleton message="正在載入全球市場數據..." />;

  const filteredAssets =
    activeRegion === 'GLOBAL'
      ? assets
      : assets.filter(a => a.region === activeRegion);

  const filteredIndices =
    activeRegion === 'GLOBAL'
      ? indices
      : indices.filter(i => i.region === activeRegion);

  const regions: { key: MarketRegion; label: string }[] = [
    { key: 'GLOBAL', label: '全球總覽' },
    { key: 'TW', label: '台灣市場 (TW)' },
    { key: 'US', label: '美國市場 (US)' },
    { key: 'ASIA', label: '亞洲市場' },
    { key: 'EU', label: '歐洲市場' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-7 h-7 text-brand-500" /> 全球金融市場
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            即時監測台灣、美國、亞洲與歐洲主要證券交易所行情指數。
          </p>
        </div>

        {/* Region Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
          {regions.map(r => (
            <button
              key={r.key}
              onClick={() => setActiveRegion(r.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeRegion === r.key
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Regional Chart */}
      <section className="space-y-3">
        <AreaTrendChart
          basePrice={
            activeRegion === 'US'
              ? 5626.0
              : activeRegion === 'ASIA'
              ? 36580.0
              : activeRegion === 'EU'
              ? 18640.0
              : 22420.5
          }
          title={`${regions.find(r => r.key === activeRegion)?.label} 指數歷史走勢`}
        />
      </section>

      {/* Regional Indices Table */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flag className="w-5 h-5 text-brand-500" /> 指數數據列表
        </h2>
        <DataTable assets={filteredIndices} pageSize={10} showCategory={true} />
      </section>

      {/* Assets List */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          全區標的涵蓋 ({filteredAssets.length})
        </h2>
        <DataTable assets={filteredAssets} pageSize={15} showCategory={true} />
      </section>
    </div>
  );
}
