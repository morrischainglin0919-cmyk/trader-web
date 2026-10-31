import React from 'react';
import { LessonDetailClient } from './LessonDetailClient';

export function generateStaticParams() {
  return [
    { id: 'candlestick-basics' }, { id: 'pe-ratio-guide' }, { id: 'etf-investing-101' }, { id: 'crypto-risk-management' }
  ];
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <LessonDetailClient id={resolvedParams.id} />;
}
