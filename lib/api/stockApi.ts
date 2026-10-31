import { mockTaiwanStocks, mockUsStocks, mockGlobalAsiaStocks, mockGlobalEuropeStocks, allGlobalStocks, generateHistoricalPoints, generateKLinePoints } from '@/data';
import { Stock, HistoricalPoint, KLinePoint } from '@/types/asset';

/**
 * Helper to generate a realistic synthetic stock model on-the-fly for any valid stock symbol
 */
function createSyntheticStock(symbol: string): Stock {
  const upper = symbol.toUpperCase();
  const hash = upper.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = (hash % 800) + 15;
  const isUp = hash % 2 === 0;
  const changePercent = (hash % 350) / 100 * (isUp ? 1 : -1);
  const change = Number((basePrice * (changePercent / 100)).toFixed(2));
  const previousClose = Number((basePrice - change).toFixed(2));
  
  // Determine region heuristic
  let region: Stock['region'] = 'US';
  let exchange = 'NASDAQ / NYSE';
  if (upper.endsWith('.T')) {
    region = 'ASIA';
    exchange = 'TSE (東京證交所)';
  } else if (upper.endsWith('.KS')) {
    region = 'ASIA';
    exchange = 'KRX (韓國證交所)';
  } else if (upper.endsWith('.HK')) {
    region = 'ASIA';
    exchange = 'HKEX (香港聯交所)';
  } else if (upper.endsWith('.SS') || upper.endsWith('.SZ')) {
    region = 'ASIA';
    exchange = 'SSE / SZSE (中國 A 股)';
  } else if (/^\d{4}$/.test(upper)) {
    region = 'TW';
    exchange = 'TWSE (台灣證交所)';
  } else if (['ASML', 'SAP', 'NVO', 'MC', 'RACE', 'SHEL', 'AZN'].includes(upper)) {
    region = 'EU';
    exchange = 'Euronext / DAX / LSE';
  }

  return {
    id: `synthetic-${upper.toLowerCase()}`,
    symbol: upper,
    name: `${upper} 全球個股`,
    nameEn: `${upper} Global Asset`,
    category: 'stock',
    region,
    exchange,
    price: basePrice,
    change,
    changePercent,
    volume: (hash % 50000 + 1000) * 100,
    previousClose,
    open: previousClose,
    high: Math.max(basePrice, previousClose) + 2,
    low: Math.min(basePrice, previousClose) - 2,
    industry: '全球跨國企業',
    description: `全球金融市場指數成分股 ${upper}，提供即時模擬行情、歷史K線與技術分析數據。`,
    lastUpdated: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
    sparkline: [previousClose - 2, previousClose, basePrice - 1, basePrice],
    metrics: {
      marketCap: (hash % 900 + 100) * 1000000000,
      peRatio: Number(((hash % 30) + 10).toFixed(1)),
      pbRatio: Number(((hash % 8) + 1.2).toFixed(1)),
      eps: Number(((hash % 15) + 1.5).toFixed(2)),
      dividendYield: Number(((hash % 4) + 0.8).toFixed(2)),
      high52w: basePrice * 1.3,
      low52w: basePrice * 0.7,
      volatility52w: 25.0
    }
  };
}

/**
 * Stock API Service Abstraction Layer
 */
export const stockApi = {
  async getTaiwanStocks(): Promise<Stock[]> {
    return Promise.resolve(mockTaiwanStocks);
  },

  async getUsStocks(): Promise<Stock[]> {
    return Promise.resolve(mockUsStocks);
  },

  async getAsiaStocks(): Promise<Stock[]> {
    return Promise.resolve(mockGlobalAsiaStocks);
  },

  async getEuropeStocks(): Promise<Stock[]> {
    return Promise.resolve(mockGlobalEuropeStocks);
  },

  async getAllStocks(): Promise<Stock[]> {
    return Promise.resolve(allGlobalStocks);
  },

  async getStocksByRegion(region: string): Promise<Stock[]> {
    if (region === 'all') return Promise.resolve(allGlobalStocks);
    return Promise.resolve(allGlobalStocks.filter(s => s.region === region));
  },

  async getStockBySymbol(symbol: string): Promise<Stock> {
    const s = symbol.toLowerCase().trim();
    const found = allGlobalStocks.find(item => item.symbol.toLowerCase() === s || item.id.toLowerCase() === s);
    if (found) return Promise.resolve(found);

    // Return dynamically generated synthetic stock model if not directly in curated list
    return Promise.resolve(createSyntheticStock(symbol));
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
