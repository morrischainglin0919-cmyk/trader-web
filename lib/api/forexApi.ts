import { mockForexPairs, generateHistoricalPoints, generateKLinePoints } from '@/data';
import { ForexPair, HistoricalPoint, KLinePoint } from '@/types/asset';

export const forexApi = {
  async getForexPairs(): Promise<ForexPair[]> {
    return Promise.resolve(mockForexPairs);
  },

  async getForexBySymbol(symbol: string): Promise<ForexPair | undefined> {
    const s = symbol.toLowerCase().replace('/', '-');
    return Promise.resolve(
      mockForexPairs.find(
        f =>
          f.symbol.toLowerCase() === symbol.toLowerCase() ||
          f.id.toLowerCase() === s ||
          f.symbol.toLowerCase().replace('/', '') === symbol.toLowerCase()
      )
    );
  },

  async getForexHistory(symbol: string, days: number = 180): Promise<HistoricalPoint[]> {
    const pair = await this.getForexBySymbol(symbol);
    const basePrice = pair ? pair.price : 1;
    return Promise.resolve(generateHistoricalPoints(basePrice, days, 0.005));
  },

  async getForexKLines(symbol: string, count: number = 120): Promise<KLinePoint[]> {
    const pair = await this.getForexBySymbol(symbol);
    const basePrice = pair ? pair.price : 1;
    return Promise.resolve(generateKLinePoints(basePrice, count, 0.006));
  },
};
