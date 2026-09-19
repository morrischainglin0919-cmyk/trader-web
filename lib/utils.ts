import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, category?: string): string {
  if (category === 'forex') {
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  }
  if (category === 'crypto') {
    if (price < 1) return price.toFixed(4);
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatChange(change: number): string {
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change.toFixed(2)}`;
}

export function formatPercent(percent: number): string {
  const prefix = percent > 0 ? '+' : '';
  return `${prefix}${percent.toFixed(2)}%`;
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  }
  if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  }
  if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  }
  return volume.toString();
}

export function formatMarketCap(marketCap?: number): string {
  if (!marketCap) return '--';
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)} 兆`;
  }
  if (marketCap >= 1e8) {
    return `$${(marketCap / 1e8).toFixed(2)} 億`;
  }
  return `$${marketCap.toLocaleString()}`;
}
