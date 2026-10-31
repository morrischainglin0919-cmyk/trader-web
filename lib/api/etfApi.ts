import { mockEtfs, generateHistoricalPoints, generateKLinePoints } from '@/data';
import { ETF, HistoricalPoint, KLinePoint } from '@/types/asset';

function createSyntheticEtf(symbol: string): ETF {
  const upper = symbol.toUpperCase().trim();
  const hash = upper.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isTaiwan = /^\d/.test(upper);
  const basePrice = isTaiwan ? (hash % 80) + 15 : (hash % 400) + 40;
  const isUp = hash % 2 === 0;
  const changePercent = Number(((hash % 200) / 100 * (isUp ? 1 : -1)).toFixed(2));
  const change = Number((basePrice * (changePercent / 100)).toFixed(2));
  const previousClose = Number((basePrice - change).toFixed(2));

  return {
    id: `etf-${upper.toLowerCase()}`,
    symbol: upper,
    name: isTaiwan ? `${upper} 台灣精選 ETF` : `${upper} 全球指標 ETF`,
    nameEn: `${upper} Index ETF`,
    category: 'etf',
    region: isTaiwan ? 'TW' : 'US',
    issuer: isTaiwan ? '元大 / 國泰 / 富邦投信' : 'Vanguard / BlackRock / State Street',
    price: basePrice,
    change,
    changePercent,
    volume: (hash % 40000 + 5000) * 100,
    previousClose,
    open: previousClose,
    high: Math.max(basePrice, previousClose) + 0.5,
    low: Math.min(basePrice, previousClose) - 0.5,
    industry: '全球指數 / 產業型 ETF',
    description: `全球金融市場指數型基金 ${upper}，涵蓋多元資產配置、成分股追蹤與歷史技術線圖分析。`,
    lastUpdated: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
    sparkline: [previousClose - 1, previousClose, basePrice + 0.5, basePrice],
    metrics: {
      aum: (hash % 800 + 50) * 100000000,
      expenseRatio: Number(((hash % 40 + 5) / 100).toFixed(2)),
      underlyingIndex: `${upper} 全球基準指數`,
      dividendYield: Number(((hash % 50 + 15) / 10).toFixed(1)),
      high52w: Number((basePrice * 1.25).toFixed(2)),
      low52w: Number((basePrice * 0.78).toFixed(2)),
      volatility52w: Number(((hash % 15) + 10).toFixed(1)),
    }
  };
}

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

  async getEtfBySymbol(symbol: string): Promise<ETF> {
    const s = symbol.toLowerCase().trim();
    const found = mockEtfs.find(e => e.symbol.toLowerCase() === s || e.id.toLowerCase() === s);
    if (found) return Promise.resolve(found);
    return Promise.resolve(createSyntheticEtf(symbol));
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
