import React from 'react';
import { CryptoDetailClient } from './CryptoDetailClient';
import { mockCryptoAssets } from '@/data';

export function generateStaticParams() {
  return mockCryptoAssets.map(crypto => ({
    symbol: crypto.symbol
  }));
}

export default async function CryptoDetailPage({
  params,
}: {
  params: any;
}) {
  const resolvedParams = await Promise.resolve(params);
  return <CryptoDetailClient symbol={resolvedParams?.symbol} />;
}
