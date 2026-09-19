'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ETF } from '@/types/asset';
import { Globe } from 'lucide-react';

export default function UsEtfsPage() {
  const { assets } = useApp();
  const usEtfs = assets.filter(a => a.category === 'etf' && a.region === 'US') as ETF[];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Globe className="w-7 h-7 text-blue-500" /> 美國股票市場 ETF (美股 ETF)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          追蹤 S&P 500、NASDAQ-100 與全美大盤關鍵 ETF（SPY, QQQ, VOO, VTI, SCHD）。
        </p>
      </div>

      <DataTable assets={usEtfs} pageSize={15} title="美股 ETF 列表與內扣費率" />
    </div>
  );
}
