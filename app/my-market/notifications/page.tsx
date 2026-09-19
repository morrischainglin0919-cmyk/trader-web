'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Bell, CheckCheck, Trash2, Info, Newspaper } from 'lucide-react';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-7 h-7 text-brand-500" /> 通知中心
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                {unreadCount} 則未讀
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            包含市場客觀條件觸發通知、系統公告與焦點新聞。
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" /> 全部標示為已讀
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
          {notifications.map(item => (
            <div
              key={item.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? 'bg-brand-50/40 dark:bg-brand-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'alert'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'
                      : item.type === 'news'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.type === 'alert' ? <Bell className="w-4 h-4" /> : item.type === 'news' ? <Newspaper className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{item.message}</p>
                  <span className="text-[11px] text-slate-400 font-mono mt-1 inline-block">{item.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!item.read && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="p-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    標示已讀
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  title="刪除通知"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-2">
          <Bell className="w-10 h-10 mx-auto opacity-40 text-brand-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">尚無新通知</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">當您的提醒條件觸發或有重大系統訊息時，會顯示於此處。</p>
        </div>
      )}
    </div>
  );
}
