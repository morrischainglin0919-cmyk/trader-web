'use client';

import React from 'react';
import Link from 'next/link';
import { NewsItem } from '@/types/news';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const categoryLabelMap: Record<string, string> = {
    taiwan: '台股新聞',
    us: '美股新聞',
    etf: 'ETF 新聞',
    crypto: '加密貨幣',
    forex: '外匯動態',
    global: '全球市場',
    announcements: '公司公告',
    all: '市場快訊',
  };

  return (
    <article className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-900/50">
            {categoryLabelMap[news.category] || '市場新聞'}
          </span>
          <span className="text-xs text-slate-400 font-mono">{news.publishedAt}</span>
        </div>

        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2 leading-snug line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
          {news.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-3 leading-relaxed">
          {news.summary}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium">
          <Newspaper className="w-3.5 h-3.5" /> {news.source}
        </span>
        <div className="flex items-center gap-1">
          {news.relatedSymbols.map(sym => (
            <Link
              key={sym}
              href={`/search?q=${encodeURIComponent(sym)}`}
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono hover:text-brand-500 transition-colors"
            >
              {sym}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};
