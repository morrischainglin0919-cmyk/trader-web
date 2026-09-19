import { HistoricalPoint, KLinePoint } from '@/types/asset';

/**
 * Generate historical price trend data for ECharts Area/Line charts
 */
export function generateHistoricalPoints(
  basePrice: number,
  daysCount: number = 180,
  volatility: number = 0.015
): HistoricalPoint[] {
  const points: HistoricalPoint[] = [];
  let currentPrice = basePrice * 0.85; // Start earlier at 85% of current
  const now = new Date();

  for (let i = daysCount; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Random walk with slight upward trend
    const randomChange = (Math.random() - 0.48) * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + randomChange, basePrice * 0.3);

    // Ensure the last point is exact basePrice
    if (i === 0) {
      currentPrice = basePrice;
    }

    const volume = Math.floor(Math.random() * 20000000 + 5000000);

    points.push({
      timestamp: dateStr,
      price: Number(currentPrice.toFixed(2)),
      volume,
    });
  }

  return points;
}

/**
 * Generate K-Line Candlestick data for stock detail pages
 */
export function generateKLinePoints(
  basePrice: number,
  count: number = 120,
  volatility: number = 0.02
): KLinePoint[] {
  const klines: KLinePoint[] = [];
  let currentClose = basePrice * 0.88;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const timeStr = d.toISOString().split('T')[0];

    const open = currentClose;
    const change = (Math.random() - 0.48) * volatility * open;
    const close = Math.max(open + change, open * 0.95);
    const high = Math.max(open, close) + Math.random() * volatility * 0.6 * open;
    const low = Math.min(open, close) - Math.random() * volatility * 0.6 * open;
    const volume = Math.floor(Math.random() * 35000000 + 10000000);

    currentClose = close;

    if (i === 0) {
      klines.push({
        time: timeStr,
        open: Number((basePrice * 0.99).toFixed(2)),
        high: Number((basePrice * 1.01).toFixed(2)),
        low: Number((basePrice * 0.98).toFixed(2)),
        close: Number(basePrice.toFixed(2)),
        volume,
      });
    } else {
      klines.push({
        time: timeStr,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });
    }
  }

  return klines;
}
