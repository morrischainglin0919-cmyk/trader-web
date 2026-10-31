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
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = await params;
  return <StockDetailClient symbol={resolvedParams.symbol} />;
}
