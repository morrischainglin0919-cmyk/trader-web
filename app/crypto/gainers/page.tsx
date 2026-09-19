'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { CryptoAsset } from '@/types/asset';

export default function CryptoGainersPage() {
  const { assets } = useApp();
  const cryptos = assets.filter(a => a.category === 'crypto') as CryptoAsset[];
  const sorted = [...cryptos].sort((a, b) => b.changePercent - a.changePercent);

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 text-red-500">
          加密貨幣 24H 漲幅排行榜
        </h1>
      </div>
      <DataTable assets={sorted} pageSize={15} />
    </div>
  );
}
