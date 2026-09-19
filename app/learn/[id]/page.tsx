'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { mockLearningLessons } from '@/data/learning';
import { ErrorState } from '@/components/common/ErrorState';
import { ArrowLeft, Clock, CheckCircle2, BookOpen } from 'lucide-react';

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;
  const lesson = mockLearningLessons.find(l => l.id === lessonId);

  if (!lesson) {
    return <ErrorState message={`找不到識別碼為 ${lessonId} 的課程主題`} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> 返回學習中心
      </Link>

      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {lesson.categoryName}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 預估閱讀 {lesson.readingTimeMinutes} 分鐘
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
            {lesson.title}
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {lesson.summary}
          </p>
        </div>

        {/* Key Takeaways Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-500" /> 本課學習重點
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {lesson.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lesson Markdown Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 text-sm whitespace-pre-line">
          {lesson.contentMarkdown}
        </div>
      </div>
    </div>
  );
}
