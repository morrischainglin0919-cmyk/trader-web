'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Stock } from '@/types/asset';
import { Globe } from 'lucide-react';

export default function UsStocksPage() {
  const { assets } = useApp();
  const usStocks = assets.filter(a => a.category === 'stock' && a.region === 'US') as Stock[];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Globe className="w-7 h-7 text-blue-500" /> 美國股票市場 (美股 US Markets)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          涵蓋 Apple、Microsoft、NVIDIA、Amazon、Alphabet、Meta、Tesla、AMD 等頂尖標的。
        </p>
      </div>

      <DataTable assets={usStocks} pageSize={15} title="美股美科技與消費巨頭行情" />
    </div>
  );
}
