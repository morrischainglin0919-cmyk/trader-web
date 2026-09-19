'use client';

import React from 'react';
import Link from 'next/link';
import { LearningLesson } from '@/types/learning';
import { BookOpen, Clock, Award } from 'lucide-react';

interface CourseCardProps {
  lesson: LearningLesson;
}

export const CourseCard: React.FC<CourseCardProps> = ({ lesson }) => {
  const difficultyMap: Record<string, { label: string; color: string }> = {
    beginner: { label: '初學者', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
    intermediate: { label: '進階觀念', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' },
    advanced: { label: '專業心法', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' },
  };

  const diffInfo = difficultyMap[lesson.difficulty] || difficultyMap.beginner;

  return (
    <Link
      href={`/learn/${lesson.id}`}
      className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all hover:shadow-md flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {lesson.categoryName}
          </span>
          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${diffInfo.color}`}>
            {diffInfo.label}
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {lesson.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {lesson.summary}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> 預估閱讀 {lesson.readingTimeMinutes} 分鐘
        </span>
        <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-semibold group-hover:translate-x-0.5 transition-transform">
          <BookOpen className="w-3.5 h-3.5" /> 開始學習
        </span>
      </div>
    </Link>
  );
};
