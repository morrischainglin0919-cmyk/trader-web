import { mockEtfs, generateHistoricalPoints, generateKLinePoints } from '@/data';
import { ETF, HistoricalPoint, KLinePoint } from '@/types/asset';

export const etfApi = {
  async getEtfs(): Promise<ETF[]> {
    return Promise.resolve(mockEtfs);
  },

  async getTaiwanEtfs(): Promise<ETF[]> {
    return Promise.resolve(mockEtfs.filter(e => e.region === 'TW'));
  },

  async getUsEtfs(): Promise<ETF[]> {
    return Promise.resolve(mockEtfs.filter(e => e.region === 'US'));
  },

  async getEtfBySymbol(symbol: string): Promise<ETF | undefined> {
    const s = symbol.toLowerCase();
    return Promise.resolve(mockEtfs.find(e => e.symbol.toLowerCase() === s || e.id.toLowerCase() === s));
  },

  async getEtfHistory(symbol: string, days: number = 180): Promise<HistoricalPoint[]> {
    const etf = await this.getEtfBySymbol(symbol);
    const basePrice = etf ? etf.price : 100;
    return Promise.resolve(generateHistoricalPoints(basePrice, days));
  },

  async getEtfKLines(symbol: string, count: number = 120): Promise<KLinePoint[]> {
    const etf = await this.getEtfBySymbol(symbol);
    const basePrice = etf ? etf.price : 100;
    return Promise.resolve(generateKLinePoints(basePrice, count));
  },
};
