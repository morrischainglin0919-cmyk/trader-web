import { mockNews } from '@/data';
import { NewsCategory, NewsItem } from '@/types/news';

export const newsApi = {
  async getNews(category: NewsCategory = 'all'): Promise<NewsItem[]> {
    if (category === 'all') {
      return Promise.resolve(mockNews);
    }
    return Promise.resolve(mockNews.filter(n => n.category === category));
  },

  async getNewsBySymbol(symbol: string): Promise<NewsItem[]> {
    if (!symbol) return Promise.resolve([]);
    const s = symbol.toLowerCase().trim();
    return Promise.resolve(
      mockNews.filter(n => n.relatedSymbols && n.relatedSymbols.some(rs => rs.toLowerCase() === s))
    );
  },

  // Alias for backward compatibility
  async getNewsByAssetSymbol(symbol: string): Promise<NewsItem[]> {
    return this.getNewsBySymbol(symbol);
  },
};
