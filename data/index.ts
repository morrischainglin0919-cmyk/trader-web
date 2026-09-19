import { mockTaiwanStocks, mockUsStocks, mockGlobalAsiaStocks, mockGlobalEuropeStocks } from './stocks';
import { mockEtfs } from './etfs';
import { mockCryptoAssets } from './crypto';
import { mockForexPairs } from './forex';
import { mockIndices } from './indices';
import { mockNews } from './news';
import { mockLearningLessons } from './learning';
import { AnyAsset } from '@/types/asset';

export * from './stocks';
export * from './etfs';
export * from './crypto';
export * from './forex';
export * from './indices';
export * from './news';
export * from './historical';
export * from './learning';

export const allAssets: AnyAsset[] = [
  ...mockTaiwanStocks,
  ...mockUsStocks,
  ...mockGlobalAsiaStocks,
  ...mockGlobalEuropeStocks,
  ...mockEtfs,
  ...mockCryptoAssets,
  ...mockForexPairs,
  ...mockIndices,
];

export function findAssetBySymbol(symbolOrId: string): AnyAsset | undefined {
  const query = symbolOrId.toLowerCase().trim();
  return allAssets.find(
    a =>
      a.symbol.toLowerCase() === query ||
      a.id.toLowerCase() === query ||
      a.name.toLowerCase() === query ||
      (a.nameEn && a.nameEn.toLowerCase() === query)
  );
}

export function searchAssets(query: string): AnyAsset[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allAssets.filter(
    a =>
      a.symbol.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      (a.nameEn && a.nameEn.toLowerCase().includes(q))
  );
}
