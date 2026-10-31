'use client';

import React from 'react';
import Link from 'next/link';
import { mockLearningLessons } from '@/data/learning';
import { ErrorState } from '@/components/common/ErrorState';
import { ArrowLeft, Clock, CheckCircle2, BookOpen } from 'lucide-react';

export function LessonDetailClient({ id }: { id: string }) {
  const lesson = mockLearningLessons.find(l => l.id === id);

  if (!lesson) {
    return <ErrorState message={`找不到識別碼為 ${id} 的課程主題`} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> 返回金融學院課程列表
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              {lesson.level}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {lesson.readTime}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
            {lesson.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {lesson.summary}
          </p>
        </div>

        {/* Content sections */}
        <div className="prose dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
          {lesson.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-500" /> {sec.heading}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Key Takeaways */}
        {lesson.takeaways && lesson.takeaways.length > 0 && (
          <div className="mt-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 本課重點精華小結
            </h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-300">
              {lesson.takeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
