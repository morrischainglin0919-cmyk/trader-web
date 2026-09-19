'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Wrench, Scale, BarChart2, Activity, Zap } from 'lucide-react';

export default function ToolsPage() {
  const { assets } = useApp();
  const [toolTab, setToolTab] = useState<'compare' | 'stats' | 'gainers' | 'volume' | 'volatility'>('compare');

  const toolsList = [
    { name: '股票數據比較', href: '/stocks/compare', icon: <Scale className="w-5 h-5 text-indigo-500" />, desc: '跨標的價格、本益比、EPS、市值對比' },
    { name: 'ETF 數據比較', href: '/etf/compare', icon: <Scale className="w-5 h-5 text-blue-500" />, desc: '資產規模 AUM、經理費率與殖利率對比' },
    { name: '加密貨幣比較', href: '/crypto/rankings', icon: <Scale className="w-5 h-5 text-amber-500" />, desc: '24H 最高最低價與鏈上市值比較' },
    { name: '外匯匯率比較', href: '/forex/compare', icon: <Scale className="w-5 h-5 text-emerald-500" />, desc: '主要貨幣對與交叉匯率趨勢對比' },
  ];

  const sortedByVolatility = [...assets].sort((a, b) => (b.metrics?.volatility52w || 0) - (a.metrics?.volatility52w || 0));

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Wrench className="w-7 h-7 text-brand-500" /> 客觀金融資料與統計分析工具
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          包含股票/ETF/加密貨幣/外匯數據比較、漲跌幅統計、成交量熱度與 52 週波動率分析。
        </p>
      </div>

      {/* Quick Compare Tools Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {toolsList.map((t, idx) => (
          <Link
            key={idx}
            href={t.href}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500/50 transition-all hover:shadow-md group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                {t.icon}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {t.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
          </Link>
        ))}
      </div>

      {/* Analysis Mode Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-4">
        <button
          onClick={() => setToolTab('volatility')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            toolTab === 'volatility' ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-1" /> 波動率分析 (52週)
        </button>
        <button
          onClick={() => setToolTab('volume')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            toolTab === 'volume' ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-1" /> 成交量爆量分析
        </button>
      </div>

      <DataTable assets={sortedByVolatility} pageSize={15} showCategory={true} title="歷史統計與波動率數據列表" />
    </div>
  );
}
