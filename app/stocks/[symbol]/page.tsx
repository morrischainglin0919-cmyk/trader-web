import React from 'react';
import { StockDetailClient } from './StockDetailClient';
import { allGlobalStocks } from '@/data';

export function generateStaticParams() {
  return allGlobalStocks.map(stock => ({
    symbol: stock.symbol
  }));
}

export default async function StockDetailPage({
  params,
}: {
  params: any;
}) {
  const resolvedParams = await Promise.resolve(params);
  return <StockDetailClient symbol={resolvedParams?.symbol} />;
}
