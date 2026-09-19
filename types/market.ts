import { AnyAsset } from './asset';

export type TimeRange = '1D' | '5D' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL';
export type KLinePeriod = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';

export interface MarketSummaryCard {
  id: string;
  name: string;
  symbol: string;
  region: 'TW' | 'US' | 'ASIA' | 'EU' | 'GLOBAL';
  value: number;
  change: number;
  changePercent: number;
  status: 'open' | 'closed' | 'pre-market';
}

export interface MarketRankings {
  gainers: AnyAsset[];
  losers: AnyAsset[];
  mostActive: AnyAsset[];
}
