import React from 'react';
import { ForexDetailClient } from './ForexDetailClient';

export function generateStaticParams() {
  return [
    { symbol: 'USD-TWD' }, { symbol: 'EUR-USD' }, { symbol: 'USD-JPY' }, { symbol: 'GBP-USD' }, { symbol: 'AUD-USD' }
  ];
}

export default async function ForexDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = await params;
  return <ForexDetailClient symbol={resolvedParams.symbol} />;
}
