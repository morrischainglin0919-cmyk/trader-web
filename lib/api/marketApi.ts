import { allAssets, mockIndices } from '@/data';
import { AnyAsset, MarketIndex } from '@/types/asset';
import { MarketRankings, MarketSummaryCard } from '@/types/market';

export const marketApi = {
  async getMarketOverviewCards(): Promise<MarketSummaryCard[]> {
    return Promise.resolve([
      {
        id: 'tw-card',
        name: '台灣市場',
        symbol: 'TAIEX',
        region: 'TW',
        value: 22420.5,
        change: 215.8,
        changePercent: 0.97,
        status: 'open',
      },
      {
        id: 'us-card',
        name: '美國市場',
        symbol: 'S&P 500',
        region: 'US',
        value: 5626.0,
        change: 30.5,
        changePercent: 0.55,
        status: 'open',
      },
      {
        id: 'asia-card',
        name: '亞洲市場',
        symbol: 'N225',
        region: 'ASIA',
        value: 36580.0,
        change: 420.0,
        changePercent: 1.16,
        status: 'open',
      },
      {
        id: 'eu-card',
        name: '歐洲市場',
        symbol: 'DAX',
        region: 'EU',
        value: 18640.2,
        change: -35.0,
        changePercent: -0.19,
        status: 'open',
      },
      {
        id: 'crypto-card',
        name: '加密貨幣',
        symbol: 'BTC',
        region: 'GLOBAL',
        value: 64250.0,
        change: 1850.0,
        changePercent: 2.96,
        status: 'open',
      },
      {
        id: 'forex-card',
        name: '外匯市場',
        symbol: 'USD/TWD',
        region: 'GLOBAL',
        value: 31.95,
        change: -0.08,
        changePercent: -0.25,
        status: 'open',
      },
    ]);
  },

  async getMarketIndices(): Promise<MarketIndex[]> {
    return Promise.resolve(mockIndices);
  },

  async getMarketRankings(): Promise<MarketRankings> {
    const sortedByChange = [...allAssets].sort((a, b) => b.changePercent - a.changePercent);
    const sortedByVolume = [...allAssets].sort((a, b) => b.volume - a.volume);

    return Promise.resolve({
      gainers: sortedByChange.slice(0, 10),
      losers: sortedByChange.slice(-10).reverse(),
      mostActive: sortedByVolume.slice(0, 10),
    });
  },
};
