'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { CryptoAsset } from '@/types/asset';
import { Coins, Flame, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function CryptoHubPage() {
  const { assets } = useApp();
  const cryptos = assets.filter(a => a.category === 'crypto') as CryptoAsset[];
  const sortedByRank = [...cryptos].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Coins className="w-7 h-7 text-amber-500" /> 24 小時加密貨幣市場 (Crypto)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" /> 24H 不間斷行情
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            提供 BTC、ETH、SOL、XRP、DOGE 等 24 小時最高最低、成交量、總市值與鏈上排名。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/crypto/rankings"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-500 transition-colors"
          >
            幣種市值榜
          </Link>
          <Link
            href="/crypto/gainers"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            24H 漲幅榜
          </Link>
          <Link
            href="/crypto/losers"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
          >
            24H 跌幅榜
          </Link>
        </div>
      </div>

      <DataTable assets={sortedByRank} pageSize={15} title="24 小時加密貨幣全市場排行榜" />
    </div>
  );
}
