import { mockCryptoAssets, generateHistoricalPoints, generateKLinePoints } from '@/data';
import { CryptoAsset, HistoricalPoint, KLinePoint } from '@/types/asset';

export const cryptoApi = {
  async getCryptoAssets(): Promise<CryptoAsset[]> {
    return Promise.resolve(mockCryptoAssets);
  },

  async getCryptoBySymbol(symbol: string): Promise<CryptoAsset | undefined> {
    const s = symbol.toLowerCase();
    return Promise.resolve(mockCryptoAssets.find(c => c.symbol.toLowerCase() === s || c.id.toLowerCase() === s));
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
