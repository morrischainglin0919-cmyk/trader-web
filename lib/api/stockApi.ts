import { mockTaiwanStocks, mockUsStocks, generateHistoricalPoints, generateKLinePoints } from '@/data';
import { Stock, HistoricalPoint, KLinePoint } from '@/types/asset';

/**
 * Stock API Service Abstraction Layer
 * Note: Currently backed by simulated mock datasets.
 * To integrate with real backend API in the future, replace internal implementations
 * with fetch('/api/stocks/...') without modifying calling page UI components.
 */
export const stockApi = {
  async getTaiwanStocks(): Promise<Stock[]> {
    return Promise.resolve(mockTaiwanStocks);
  },

  async getUsStocks(): Promise<Stock[]> {
    return Promise.resolve(mockUsStocks);
  },

  async getAllStocks(): Promise<Stock[]> {
    return Promise.resolve([...mockTaiwanStocks, ...mockUsStocks]);
  },

  async getStockBySymbol(symbol: string): Promise<Stock | undefined> {
    const s = symbol.toLowerCase();
    const all = [...mockTaiwanStocks, ...mockUsStocks];
    const found = all.find(item => item.symbol.toLowerCase() === s || item.id.toLowerCase() === s);
    return Promise.resolve(found);
  },

  async getStockHistory(symbol: string, days: number = 180): Promise<HistoricalPoint[]> {
    const stock = await this.getStockBySymbol(symbol);
    const basePrice = stock ? stock.price : 100;
    return Promise.resolve(generateHistoricalPoints(basePrice, days));
  },

  async getStockKLines(symbol: string, count: number = 120): Promise<KLinePoint[]> {
    const stock = await this.getStockBySymbol(symbol);
    const basePrice = stock ? stock.price : 100;
    return Promise.resolve(generateKLinePoints(basePrice, count));
  },
};
