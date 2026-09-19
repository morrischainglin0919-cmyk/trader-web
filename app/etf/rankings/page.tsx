'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ETF } from '@/types/asset';
import { Award } from 'lucide-react';

export default function EtfRankingsPage() {
  const { assets } = useApp();
  const etfs = assets.filter(a => a.category === 'etf') as ETF[];
  const sortedByAum = [...etfs].sort((a, b) => (b.metrics?.aum || 0) - (a.metrics?.aum || 0));

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-7 h-7 text-amber-500" /> ETF 資產規模與績效排行榜
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          依據基金總資產規模 (AUM) 與單日漲跌幅排序展現市場資金偏好。
        </p>
      </div>

      <DataTable assets={sortedByAum} pageSize={15} title="ETF 資產規模排行榜" />
    </div>
  );
}
