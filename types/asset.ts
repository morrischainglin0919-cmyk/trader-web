export type AssetCategory = 'stock' | 'etf' | 'crypto' | 'forex' | 'index';
export type MarketRegion = 'TW' | 'US' | 'ASIA' | 'EU' | 'GLOBAL';

export interface HistoricalPoint {
  timestamp: string; // ISO string or date format YYYY-MM-DD
  price: number;
  volume?: number;
}

export interface KLinePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FinancialMetric {
  marketCap?: number;
  peRatio?: number;
  pbRatio?: number;
  eps?: number;
  dividendYield?: number;
  high52w?: number;
  low52w?: number;
  volatility52w?: number;
  aum?: number; // For ETFs
  expenseRatio?: number; // For ETFs
  underlyingIndex?: string; // For ETFs
  circulatingSupply?: number; // For Crypto
  maxSupply?: number; // For Crypto
  high24h?: number; // For Crypto/Forex
  low24h?: number; // For Crypto/Forex
}

export interface BaseAsset {
  id: string;
  symbol: string;
  name: string;
  nameEn?: string;
  category: AssetCategory;
  region: MarketRegion;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  metrics: FinancialMetric;
  sparkline: number[];
  lastUpdated: string;
  industry?: string;
  description?: string;
}

export interface Stock extends BaseAsset {
  category: 'stock';
  exchange: string;
}

export interface ETF extends BaseAsset {
  category: 'etf';
  issuer: string;
}

export interface CryptoAsset extends BaseAsset {
  category: 'crypto';
  rank: number;
}

export interface ForexPair extends BaseAsset {
  category: 'forex';
  baseCurrency: string;
  quoteCurrency: string;
}

export interface MarketIndex extends BaseAsset {
  category: 'index';
  country: string;
}

export type AnyAsset = Stock | ETF | CryptoAsset | ForexPair | MarketIndex;
