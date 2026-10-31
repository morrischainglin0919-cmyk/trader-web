import { mockCryptoAssets, generateHistoricalPoints, generateKLinePoints } from '@/data';
import { CryptoAsset, HistoricalPoint, KLinePoint } from '@/types/asset';

function createSyntheticCrypto(symbol: string): CryptoAsset {
  const upper = symbol.toUpperCase().trim();
  const hash = upper.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = (hash % 100 === 0) ? (hash % 500) + 10 : (hash % 200) / 10 + 0.15;
  const isUp = hash % 2 === 0;
  const changePercent = Number(((hash % 600) / 100 * (isUp ? 1 : -1)).toFixed(2));
  const change = Number((basePrice * (changePercent / 100)).toFixed(4));
  const previousClose = Number((basePrice - change).toFixed(4));

  return {
    id: `crypto-${upper.toLowerCase()}`,
    symbol: upper,
    name: `${upper} 加密代幣`,
    nameEn: `${upper} Token`,
    category: 'crypto',
    region: 'GLOBAL',
    rank: (hash % 80) + 15,
    price: basePrice,
    change,
    changePercent,
    volume: (hash % 80000 + 1000) * 10000,
    previousClose,
    open: previousClose,
    high: Math.max(basePrice, previousClose) * 1.05,
    low: Math.min(basePrice, previousClose) * 0.95,
    industry: '去中心化協議 / Web3 數位資產',
    description: `全球去中心化加密代幣 ${upper}，提供 24 小時連續即時行情、深度流動性與歷史鏈上數據分析。`,
    lastUpdated: '24小時即時',
    sparkline: [previousClose * 0.96, previousClose, basePrice * 1.02, basePrice],
    metrics: {
      marketCap: (hash % 200 + 10) * 100000000,
      circulatingSupply: (hash % 500 + 50) * 10000000,
      high24h: Math.max(basePrice, previousClose) * 1.05,
      low24h: Math.min(basePrice, previousClose) * 0.95,
      high52w: basePrice * 1.8,
      low52w: basePrice * 0.35,
      volatility52w: 68.0,
    }
  };
}

export const cryptoApi = {
  async getCryptoAssets(): Promise<CryptoAsset[]> {
    return Promise.resolve(mockCryptoAssets);
  },

  async getCryptoBySymbol(symbol: string): Promise<CryptoAsset> {
    const s = symbol.toLowerCase().trim();
    const found = mockCryptoAssets.find(c => c.symbol.toLowerCase() === s || c.id.toLowerCase() === s);
    if (found) return Promise.resolve(found);
    return Promise.resolve(createSyntheticCrypto(symbol));
  },

  async getCryptoHistory(symbol: string, days: number = 180): Promise<HistoricalPoint[]> {
    const crypto = await this.getCryptoBySymbol(symbol);
    const basePrice = crypto ? crypto.price : 1000;
    return Promise.resolve(generateHistoricalPoints(basePrice, days, 0.035));
  },

  async getCryptoKLines(symbol: string, count: number = 120): Promise<KLinePoint[]> {
    const crypto = await this.getCryptoBySymbol(symbol);
    const basePrice = crypto ? crypto.price : 1000;
    return Promise.resolve(generateKLinePoints(basePrice, count, 0.04));
  },
};
