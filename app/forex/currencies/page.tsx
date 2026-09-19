'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ForexPair } from '@/types/asset';

export default function ForexCurrenciesPage() {
  const { assets } = useApp();
  const forexPairs = assets.filter(a => a.category === 'forex') as ForexPair[];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
          全球通用貨幣與交叉匯率
        </h1>
      </div>
      <DataTable assets={forexPairs} pageSize={15} />
    </div>
  );
}
