import { searchAssets, allAssets } from '@/data';
import { stockApi } from './stockApi';
import { etfApi } from './etfApi';
import { cryptoApi } from './cryptoApi';
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

    // Universal Market Fallback:
    // If no exact/partial matches found in predefined assets and query is a valid ticker-like string
    if (results.length === 0 && q.length >= 2 && !q.includes(' ')) {
      const upper = q.toUpperCase();
      
      if (filter.category === 'crypto' || (!filter.category && /^[A-Z0-9]{2,10}$/.test(upper) && !/^\d{4}$/.test(upper))) {
        const syntheticCrypto = await cryptoApi.getCryptoBySymbol(upper);
        results.push(syntheticCrypto);
      }
      
      if (filter.category === 'etf' || (!filter.category && (upper.startsWith('00') || ['SPY','QQQ','VOO','IVV','IWM'].includes(upper)))) {
        const syntheticEtf = await etfApi.getEtfBySymbol(upper);
        results.push(syntheticEtf);
      }
      
      if (filter.category === 'stock' || (!filter.category && results.length === 0)) {
        const syntheticStock = await stockApi.getStockBySymbol(upper);
        results.push(syntheticStock);
      }
    }

    return Promise.resolve(results);
  },

  async getPopularSearches(): Promise<AnyAsset[]> {
    const popularSymbols = ['2330', 'NVDA', 'AAPL', 'BTC', 'ETH', '0050', 'QQQ', 'SPY', 'USD/TWD'];
    return Promise.resolve(
      allAssets.filter(a => popularSymbols.includes(a.symbol))
    );
  },
};
