import React from 'react';
import { EtfDetailClient } from './EtfDetailClient';
import { mockEtfs } from '@/data';

export function generateStaticParams() {
  return mockEtfs.map(etf => ({
    symbol: etf.symbol
  }));
}

export default async function EtfDetailPage({
  params,
}: {
  params: any;
}) {
  const resolvedParams = await Promise.resolve(params);
  return <EtfDetailClient symbol={resolvedParams?.symbol} />;
}
