'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DataTable } from '@/components/common/DataTable';
import { Bookmark, Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function WatchlistPage() {
  const {
    watchlists,
    activeWatchlistId,
    setActiveWatchlistId,
    createWatchlist,
    renameWatchlist,
    deleteWatchlist,
    assets,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];
  const watchlistAssets = assets.filter(a => activeWatchlist.symbols.includes(a.symbol));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createWatchlist(newListName.trim());
    setNewListName('');
    setIsCreating(false);
  };

  const handleRenameSubmit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editingName.trim()) return;
    renameWatchlist(id, editingName.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-amber-500" /> 我的觀察清單管理
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            建立多維度追蹤清單（台股、美股、ETF、加密貨幣、外匯），自由新增、命名與維護。
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> 建立新觀察清單
        </button>
      </div>

      {/* Modal: Create New Watchlist */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
          <input
            type="text"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            placeholder="請輸入新清單名稱（如：高潛力科技股、配息組合）..."
            className="flex-1 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            autoFocus
            required
          />
          <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600">
            確認建立
          </button>
          <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 text-xs text-slate-400">
            取消
          </button>
        </form>
      )}

      {/* Watchlist Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
        {watchlists.map(list => {
          const isActive = list.id === activeWatchlistId;
          const isEditing = editingId === list.id;

          if (isEditing) {
            return (
              <form key={list.id} onSubmit={e => handleRenameSubmit(list.id, e)} className="flex items-center gap-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border rounded"
                  autoFocus
                />
                <button type="submit" className="p-1 text-emerald-500"><Check className="w-3.5 h-3.5" /></button>
              </form>
            );
          }

          return (
            <div
              key={list.id}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              onClick={() => setActiveWatchlistId(list.id)}
            >
              <span>{list.name} ({list.symbols.length})</span>

              {isActive && (
                <div className="flex items-center gap-0.5 ml-1" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setEditingId(list.id);
                      setEditingName(list.name);
                    }}
                    className="p-1 hover:text-slate-200"
                    title="重新命名"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {!list.isDefault && (
                    <button
                      onClick={() => deleteWatchlist(list.id)}
                      className="p-1 hover:text-red-200"
                      title="刪除清單"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Watchlist Assets Table */}
      {watchlistAssets.length > 0 ? (
        <DataTable assets={watchlistAssets} pageSize={15} showCategory={true} title={`${activeWatchlist.name} 中的資產行情`} />
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-3">
          <Bookmark className="w-10 h-10 mx-auto opacity-40 text-amber-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">「{activeWatchlist.name}」目前尚無收藏資產</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            您可以透過頂部全站搜尋，或在股票、ETF、加密貨幣等列表中點擊書籤圖示進行收藏。
          </p>
        </div>
      )}
    </div>
  );
}
