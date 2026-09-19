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
    const s = symbol.toLowerCase();
    return Promise.resolve(
      mockNews.filter(n => n.relatedSymbols.some(rs => rs.toLowerCase() === s))
    );
  },
};
