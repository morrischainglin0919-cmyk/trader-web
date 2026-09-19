import { searchAssets, allAssets } from '@/data';
import { AnyAsset, AssetCategory } from '@/types/asset';

export interface SearchFilter {
  category?: AssetCategory | 'all';
  query: string;
}

export const searchApi = {
  async search(filter: SearchFilter): Promise<AnyAsset[]> {
    const q = filter.query.toLowerCase().trim();
    if (!q) return [];
    let results = searchAssets(q);
    if (filter.category && filter.category !== 'all') {
      results = results.filter(a => a.category === filter.category);
    }
    return Promise.resolve(results);
  },

  async getPopularSearches(): Promise<AnyAsset[]> {
    // 2330, NVDA, BTC, 0050, USD/TWD
    const popularSymbols = ['2330', 'NVDA', 'BTC', '0050', 'USD/TWD'];
    return Promise.resolve(
      allAssets.filter(a => popularSymbols.includes(a.symbol))
    );
  },
};
