'use client';

import React, { useState } from 'react';
import { mockLearningLessons } from '@/data/learning';
import { LearningCategory } from '@/types/learning';
import { CourseCard } from '@/components/cards/CourseCard';
import { BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export default function LearnHubPage() {
  const [activeCategory, setActiveCategory] = useState<LearningCategory | 'all'>('all');

  const filteredLessons =
    activeCategory === 'all'
      ? mockLearningLessons
      : mockLearningLessons.filter(l => l.category === activeCategory);

  const categories: { key: LearningCategory | 'all'; label: string }[] = [
    { key: 'all', label: '全部主題' },
    { key: 'stock_basics', label: '股票入門' },
    { key: 'etf_101', label: 'ETF 入門' },
    { key: 'kline_guide', label: 'K 線教學' },
    { key: 'fundamentals', label: '基本面分析' },
    { key: 'risk_management', label: '風險管理' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-emerald-500" /> 金融理財學習中心
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            零基礎教學
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          從零開始掌握股票、ETF、K 線圖解讀、基本面財務指標與風險控管觀念。
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map(lesson => (
          <CourseCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
