'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnyAsset } from '@/types/asset';
import { PriceDisplay } from './PriceDisplay';
import { ChangeBadge } from './ChangeBadge';
import { formatVolume, formatMarketCap } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import { Bookmark, BookmarkCheck, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  assets: AnyAsset[];
  title?: string;
  pageSize?: number;
  showCategory?: boolean;
}

type SortField = 'symbol' | 'name' | 'price' | 'changePercent' | 'volume' | 'marketCap';

export const DataTable: React.FC<DataTableProps> = ({
  assets,
  title,
  pageSize = 10,
  showCategory = false,
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [sortField, setSortField] = useState<SortField>('changePercent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAssets = assets.filter(
    a =>
      a.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let aVal: any = a[sortField as keyof AnyAsset];
    let bVal: any = b[sortField as keyof AnyAsset];

    if (sortField === 'marketCap') {
      aVal = a.metrics?.marketCap || 0;
      bVal = b.metrics?.marketCap || 0;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
  });

  const totalPages = Math.ceil(sortedAssets.length / pageSize) || 1;
  const paginatedAssets = sortedAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getHref = (asset: AnyAsset) => {
    switch (asset.category) {
      case 'stock':
        return `/stocks/${asset.symbol}`;
      case 'etf':
        return `/etf/${asset.symbol}`;
      case 'crypto':
        return `/crypto/${asset.symbol}`;
      case 'forex':
        return `/forex/${asset.symbol.replace('/', '-')}`;
      default:
        return `/search?q=${asset.symbol}`;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {(title || assets.length > 5) && (
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {title && <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={filterQuery}
              onChange={e => {
                setFilterQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="快速篩選名稱或代號..."
              className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4 w-10 text-center">自訂</th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  資產名稱 / 代號 <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              {showCategory && <th className="py-3 px-4">分類</th>}
              <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end gap-1">
                  目前價格 <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200" onClick={() => handleSort('changePercent')}>
                <div className="flex items-center justify-end gap-1">
                  漲跌幅 (%) <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 hidden md:table-cell" onClick={() => handleSort('volume')}>
                <div className="flex items-center justify-end gap-1">
                  成交量 <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 hidden lg:table-cell" onClick={() => handleSort('marketCap')}>
                <div className="flex items-center justify-end gap-1">
                  市值 / 規模 <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-sans">
            {paginatedAssets.length > 0 ? (
              paginatedAssets.map(asset => {
                const inWatchlist = isInWatchlist(asset.symbol);
                return (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={e => {
                          e.preventDefault();
                          if (inWatchlist) removeFromWatchlist(asset.symbol);
                          else addToWatchlist(asset.symbol);
                        }}
                        className="text-slate-400 hover:text-amber-500 transition-colors"
                        title={inWatchlist ? '從觀察清單移除' : '加入觀察清單'}
                      >
                        {inWatchlist ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={getHref(asset)} className="group flex flex-col">
                        <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-2">
                          <span>{asset.name}</span>
                          <span className="text-xs text-slate-400 font-mono font-medium">{asset.symbol}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {asset.industry || ('exchange' in asset ? asset.exchange : '') || asset.region}
                        </span>
                      </Link>
                    </td>
                    {showCategory && (
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          {asset.category}
                        </span>
                      </td>
                    )}
                    <td className="py-3 px-4 text-right">
                      <PriceDisplay
                        symbol={asset.symbol}
                        price={asset.price}
                        change={asset.change}
                        changePercent={asset.changePercent}
                        category={asset.category}
                        showBadge={false}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <ChangeBadge changePercent={asset.changePercent} changeAmount={asset.change} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-slate-600 dark:text-slate-400 hidden md:table-cell">
                      {formatVolume(asset.volume)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                      {formatMarketCap(asset.metrics?.marketCap || asset.metrics?.aum)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                  沒有符合條目的數據資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            顯示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, sortedAssets.length)} 筆 (共 {sortedAssets.length} 筆)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
