'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Clock, Trash2, Search, ArrowRight } from 'lucide-react';

export default function SearchHistoryPage() {
  const { searchHistory, deleteSearchHistory, clearSearchHistory } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-500" /> 個人搜尋紀錄
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            紀錄您過往搜尋的股票代號、ETF 與匯率關鍵字。
          </p>
        </div>

        {searchHistory.length > 0 && (
          <button
            onClick={clearSearchHistory}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" /> 清除全部歷史
          </button>
        )}
      </div>

      {searchHistory.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
          {searchHistory.map(item => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Link
                href={`/search?q=${encodeURIComponent(item.query)}`}
                className="flex items-center gap-3 flex-1"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 font-mono">
                    {item.query} {item.name && <span className="font-sans font-normal text-slate-500">({item.name})</span>}
                  </div>
                  <div className="text-xs text-slate-400">搜尋時間：{item.timestamp}</div>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href={`/search?q=${encodeURIComponent(item.query)}`}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  再次搜尋 <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => deleteSearchHistory(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="刪除單筆紀錄"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-2">
          <Clock className="w-10 h-10 mx-auto opacity-40 text-indigo-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">尚無搜尋歷史紀錄</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">當您在頂部搜尋框進行檢索時，搜尋歷史將自動顯示在此。</p>
        </div>
      )}
    </div>
  );
}
