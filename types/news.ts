export type NewsCategory = 
  | 'all'
  | 'taiwan'
  | 'us'
  | 'etf'
  | 'crypto'
  | 'forex'
  | 'global'
  | 'announcements';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string; // ISO String or relative time
  category: NewsCategory;
  relatedSymbols: string[];
  url?: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}
