'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { AlertCategory, AlertOperator } from '@/types/alert';
import { AlertCard } from '@/components/cards/AlertCard';
import { Bell, Plus, Filter, Info } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, addAlert, assets } = useApp();
  const [activeCategory, setActiveCategory] = useState<AlertCategory>('all');
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [symbol, setSymbol] = useState('NVDA');
  const [operator, setOperator] = useState<AlertOperator>('less_than');
  const [targetValue, setTargetValue] = useState('150');
  const [note, setNote] = useState('');

  const filteredAlerts =
    activeCategory === 'all'
      ? alerts
      : alerts.filter(a => a.category === activeCategory);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetValue);
    if (isNaN(val)) return;

    const matchedAsset = assets.find(a => a.symbol.toLowerCase() === symbol.toLowerCase());
    const assetName = matchedAsset ? matchedAsset.name : symbol;
    const currentPrice = matchedAsset ? matchedAsset.price : val;

    addAlert({
      symbol: symbol.toUpperCase(),
      assetName,
      category: 'price',
      operator,
      targetValue: val,
      currentValue: currentPrice,
      enabled: true,
      note: note || '個人設定之客觀價格門檻',
    });

    setIsCreating(false);
    setNote('');
  };

  const categories: { key: AlertCategory; label: string }[] = [
    { key: 'all', label: '全部提醒' },
    { key: 'price', label: '價格門檻提醒' },
    { key: 'change', label: '漲跌幅提醒' },
    { key: 'volume', label: '成交量異常' },
    { key: 'news', label: '新聞事件' },
    { key: 'index', label: '市場指數提醒' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-7 h-7 text-purple-500" /> 市場客觀條件提醒中心
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            設定客觀價格、漲跌幅與成交量條件提醒。無任何投資建議與交易操作。
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> 建立新條件提醒
        </button>
      </div>

      {/* Modal: Create Alert */}
      {isCreating && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-500" /> 新建市場條件提醒
            </h3>
            <span className="text-xs text-slate-400">僅供個人客觀條件檢測</span>
          </div>

          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">目標資產代號</label>
              <input
                type="text"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                placeholder="例如：NVDA, 2330, BTC"
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">觸發條件</label>
              <select
                value={operator}
                onChange={e => setOperator(e.target.value as AlertOperator)}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="less_than">價格低於 (≤)</option>
                <option value="greater_than">價格高於 (≥)</option>
                <option value="crosses_below">跌破點位</option>
                <option value="crosses_above">向上突破</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">目標數值</label>
              <input
                type="number"
                step="0.01"
                value={targetValue}
                onChange={e => setTargetValue(e.target.value)}
                placeholder="150"
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
                required
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                建立提醒
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 text-xs text-slate-400"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      {filteredAlerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-2">
          <Bell className="w-10 h-10 mx-auto opacity-40 text-purple-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">目前沒有設定任何客觀條件提醒</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">點擊上方「建立新條件提醒」新增您的第一個市場門檻通知。</p>
        </div>
      )}
    </div>
  );
}
