/**
 * Yahoo Finance Public API Client
 * Multi-strategy real-time data fetcher with CORS proxy rotation, CoinGecko support,
 * and resilient fallback.
 */

export interface YahooQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPreviousClose: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  currency?: string;
  marketState?: string;
  timestamp: string;
  sparkline?: number[];
  isRealTime: boolean;
  source: string;
}

/**
 * Maps standard asset symbols to Yahoo Finance ticker format
 */
export function toYahooTicker(symbol: string, category?: string): string {
  const s = symbol.trim().toUpperCase();

  // If already contains exchange suffix
  if (s.includes('.') || s.includes('-')) {
    return s;
  }

  // Taiwan 4-5 digit stock/ETF codes
  if (/^\d{4,5}[A-Z]?$/.test(s)) {
    return `${s}.TW`;
  }

  // Crypto pairs
  if (category === 'crypto' || ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'SUI', 'NEAR', 'PEPE'].includes(s)) {
    return `${s}-USD`;
  }

  return s;
}

/**
 * Try fetching from a URL with timeout
 */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Fetch real-time market quote from Yahoo Finance
 */
export async function fetchYahooQuote(symbol: string, category?: string, timeoutMs = 3500): Promise<YahooQuote | null> {
  // If it's a crypto token, prioritize CoinGecko (100% browser CORS support)
  if (category === 'crypto' || ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'SUI', 'NEAR', 'PEPE'].includes(symbol.toUpperCase())) {
    const gecko = await fetchCoinGeckoPrice(symbol);
    if (gecko) {
      const price = gecko.price;
      const changePercent = gecko.change24h;
      const change = Number((price * (changePercent / 100)).toFixed(4));
      const prevClose = Number((price - change).toFixed(4));

      return {
        symbol,
        regularMarketPrice: price,
        regularMarketChange: change,
        regularMarketChangePercent: changePercent,
        regularMarketPreviousClose: prevClose,
        currency: 'USD',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
        isRealTime: true,
        source: 'CoinGecko Live API'
      };
    }
  }

  const ticker = toYahooTicker(symbol, category);
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;

  // Multi-proxy endpoints
  const endpoints = [
    targetUrl, // Direct (works in Node/SSR/Electron)
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
  ];

  for (const ep of endpoints) {
    try {
      const data = await fetchWithTimeout(ep, timeoutMs);
      const result = data?.chart?.result?.[0];
      if (result && result.meta && typeof result.meta.regularMarketPrice === 'number') {
        const meta = result.meta;
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose || price;
        const change = Number((price - prevClose).toFixed(4));
        const changePercent = prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
        const quotes = result.indicators?.quote?.[0]?.close || [];
        const sparkline = quotes.filter((v: number | null) => typeof v === 'number' && !isNaN(v)).slice(-10);

        return {
          symbol,
          regularMarketPrice: Number(price.toFixed(4)),
          regularMarketChange: change,
          regularMarketChangePercent: changePercent,
          regularMarketPreviousClose: Number(prevClose.toFixed(4)),
          regularMarketOpen: meta.regularMarketOpen || meta.open,
          regularMarketDayHigh: meta.regularMarketDayHigh || meta.dayHigh,
          regularMarketDayLow: meta.regularMarketDayLow || meta.dayLow,
          regularMarketVolume: meta.regularMarketVolume || meta.volume,
          currency: meta.currency,
          marketState: meta.marketState,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
          sparkline: sparkline.length >= 2 ? sparkline : undefined,
          isRealTime: true,
          source: 'Yahoo Finance API (即時)'
        };
      }
    } catch (e) {
      // Continue to next endpoint
    }
  }

  return null;
}

/**
 * Fetch real-time crypto prices directly from CoinGecko API (No CORS issue)
 */
export async function fetchCoinGeckoPrice(symbol: string): Promise<{ price: number; change24h: number } | null> {
  const symbolMap: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'ADA': 'cardano',
    'AVAX': 'avalanche-2',
    'LINK': 'chainlink',
    'SUI': 'sui',
    'NEAR': 'near',
    'PEPE': 'pepe'
  };

  const coinId = symbolMap[symbol.toUpperCase()];
  if (!coinId) return null;

  try {
    const data = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
      3000
    );
    const info = data?.[coinId];
    if (info && typeof info.usd === 'number') {
      return {
        price: info.usd,
        change24h: Number((info.usd_24h_change || 0).toFixed(2))
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}
