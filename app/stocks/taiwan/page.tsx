'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Stock } from '@/types/asset';
import { Flag } from 'lucide-react';

export default function TaiwanStocksPage() {
  const { assets } = useApp();
  const twStocks = assets.filter(a => a.category === 'stock' && a.region === 'TW') as Stock[];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flag className="w-7 h-7 text-red-500" /> 台灣股票市場 (台股 TAIEX)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          完整涵蓋台積電、聯發科、鴻海、廣達、台達電、日月光投控、中華電、富邦金、國泰金等核心指標股。
        </p>
      </div>

      <DataTable assets={twStocks} pageSize={15} title="台股全市場指標股票行情" />
    </div>
  );
}
