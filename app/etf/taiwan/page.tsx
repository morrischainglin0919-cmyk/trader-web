'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ETF } from '@/types/asset';
import { Flag } from 'lucide-react';

export default function TaiwanEtfsPage() {
  const { assets } = useApp();
  const twEtfs = assets.filter(a => a.category === 'etf' && a.region === 'TW') as ETF[];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flag className="w-7 h-7 text-red-500" /> 台灣市場 ETF (台股 ETF)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          包含 0050、006208 市值型標的與 00878、00919、00929 等熱門高股息 ETF。
        </p>
      </div>

      <DataTable assets={twEtfs} pageSize={15} title="台股 ETF 列表與資產規模" />
    </div>
  );
}
