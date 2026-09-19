'use client';

import React, { useState, useEffect } from 'react';
import { newsApi } from '@/lib/api';
import { NewsCategory, NewsItem } from '@/types/news';
import { NewsCard } from '@/components/cards/NewsCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Newspaper, Filter } from 'lucide-react';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await newsApi.getNews(activeCategory);
      setNewsList(data);
      setLoading(false);
    }
    load();
  }, [activeCategory]);

  const categories: { key: NewsCategory; label: string }[] = [
    { key: 'all', label: '全部新聞' },
    { key: 'taiwan', label: '台股新聞' },
    { key: 'us', label: '美股新聞' },
    { key: 'etf', label: 'ETF 新聞' },
    { key: 'crypto', label: '加密貨幣' },
    { key: 'forex', label: '外匯動態' },
    { key: 'global', label: '全球市場' },
    { key: 'announcements', label: '公司公告' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-indigo-500" /> 全球即時市場新聞中心
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            彙整台股、美股、ETF、加密貨幣與外匯市場最新重大資訊與公告。
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton message="載入焦點市場新聞中..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsList.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
}
