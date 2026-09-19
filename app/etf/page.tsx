'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { ETF } from '@/types/asset';
import { PieChart, Layers, Globe, Award } from 'lucide-react';

export default function EtfHubPage() {
  const { assets } = useApp();
  const etfs = assets.filter(a => a.category === 'etf') as ETF[];
  const twEtfs = etfs.filter(e => e.region === 'TW');
  const usEtfs = etfs.filter(e => e.region === 'US');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChart className="w-7 h-7 text-indigo-500" /> 指數型與高股息 ETF 專區
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            解析 0050、00878、00919、SPY、QQQ、VOO、VTI 等資產規模、追蹤指數與殖利率。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/etf/taiwan"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            台股 ETF
          </Link>
          <Link
            href="/etf/us"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            美股 ETF
          </Link>
          <Link
            href="/etf/rankings"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            ETF 排行榜
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" /> 台灣市場人氣 ETF (0050, 00878, 00919...)
          </h2>
        </div>
        <DataTable assets={twEtfs} pageSize={10} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" /> 美國大盤與科技 ETF (SPY, QQQ, VOO...)
          </h2>
        </div>
        <DataTable assets={usEtfs} pageSize={10} />
      </section>
    </div>
  );
}
