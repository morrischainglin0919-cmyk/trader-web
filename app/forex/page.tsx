'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ForexPair } from '@/types/asset';
import { DollarSign, Globe, RefreshCw } from 'lucide-react';

export default function ForexHubPage() {
  const { assets } = useApp();
  const forexPairs = assets.filter(a => a.category === 'forex') as ForexPair[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-emerald-500" /> 全球外匯與匯率動態 (Forex)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            提供 USD/TWD、USD/JPY、EUR/USD、GBP/USD 等主要貨幣對即期匯率與趨勢圖。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/forex/pairs"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-500 transition-colors"
          >
            主要貨幣對
          </Link>
          <Link
            href="/forex/rankings"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-500 transition-colors"
          >
            匯率漲跌榜
          </Link>
        </div>
      </div>

      <DataTable assets={forexPairs} pageSize={15} title="全球主要外匯貨幣對行情" />
    </div>
  );
}
