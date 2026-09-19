'use client';

import React from 'react';
import { Alert } from '@/types/alert';
import { useApp } from '@/lib/context/AppContext';
import { Bell, Trash2, Power } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { toggleAlert, deleteAlert } = useApp();

  const operatorTextMap: Record<string, string> = {
    less_than: '價格低於',
    greater_than: '價格高於',
    equal: '價格等於',
    crosses_above: '向上突破',
    crosses_below: '跌破點位',
  };

  return (
    <div
      className={`p-4 bg-white dark:bg-slate-900 border rounded-xl transition-all ${
        alert.enabled
          ? 'border-slate-200 dark:border-slate-800 shadow-sm'
          : 'border-slate-200/60 dark:border-slate-800/40 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs font-mono">
            {alert.symbol}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{alert.assetName}</h4>
            <span className="text-xs text-slate-400 font-mono">建置時間: {alert.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleAlert(alert.id)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              alert.enabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
            title={alert.enabled ? '停用提醒' : '啟用提醒'}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{alert.enabled ? '啟用中' : '已停用'}</span>
          </button>

          <button
            onClick={() => deleteAlert(alert.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="刪除提醒"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs font-mono flex items-center justify-between text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-brand-500" />
          <span>觸發條件：</span>
          <span className="font-bold">{operatorTextMap[alert.operator] || alert.operator}</span>
          <span className="font-bold text-brand-600 dark:text-brand-400">{alert.targetValue}</span>
        </div>
        <div className="text-slate-400">現價: {alert.currentValue}</div>
      </div>

      {alert.note && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
          備註：{alert.note}
        </p>
      )}
    </div>
  );
};
