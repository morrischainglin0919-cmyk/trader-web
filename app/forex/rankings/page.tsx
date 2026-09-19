'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ForexPair } from '@/types/asset';

export default function ForexRankingsPage() {
  const { assets } = useApp();
  const forexPairs = assets.filter(a => a.category === 'forex') as ForexPair[];
  const sorted = [...forexPairs].sort((a, b) => b.changePercent - a.changePercent);

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
          外匯貨幣對升貶值排行榜
        </h1>
      </div>
      <DataTable assets={sorted} pageSize={15} />
    </div>
  );
}
