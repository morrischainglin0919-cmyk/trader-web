'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { searchAssets } from '@/data';
import { AnyAsset } from '@/types/asset';
import { PriceDisplay } from '../common/PriceDisplay';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  Clock,
  ChevronRight,
  User,
  SlidersHorizontal,
} from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    toggleSidebar,
    unreadCount,
    searchHistory,
    addSearchHistory,
  } = useApp();

  const [query, setQuery] = useState('');
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<AnyAsset[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const results = searchAssets(query);
      setSearchResults(results.slice(0, 8));
      setIsOpenDropdown(true);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAsset = (asset: AnyAsset) => {
    addSearchHistory(asset.symbol, asset.symbol, asset.name);
    setQuery('');
    setIsOpenDropdown(false);
    if (asset.category === 'stock') {
      router.push(`/stocks/${asset.symbol}`);
    } else if (asset.category === 'etf') {
      router.push(`/etf/${asset.symbol}`);
    } else if (asset.category === 'crypto') {
      router.push(`/crypto/${asset.symbol}`);
    } else if (asset.category === 'forex') {
      router.push(`/forex/${asset.symbol.replace('/', '-')}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(asset.symbol)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addSearchHistory(query);
    setIsOpenDropdown(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Trigger + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            title="切換側邊欄"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                全球金融觀測網
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-medium leading-none">
                FINANCIAL INTELLIGENCE
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Autocomplete Search Input */}
        <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsOpenDropdown(true)}
              placeholder="搜尋股票、ETF、加密貨幣、外匯、指數……（例如：2330, 台積電, NVDA, 0050, BTC）"
              className="w-full pl-10 pr-10 py-2 text-xs md:text-sm bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-sans"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Autocomplete & Suggestions Dropdown */}
          {isOpenDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {query.trim() ? (
                searchResults.length > 0 ? (
                  <div className="py-2 divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      搜尋匹配結果 ({searchResults.length})
                    </div>
                    {searchResults.map(asset => (
                      <button
                        key={asset.id}
                        onClick={() => handleSelectAsset(asset)}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                            {asset.category}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              <span>{asset.name}</span>
                              <span className="text-xs text-slate-400 font-mono">{asset.symbol}</span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {asset.region} • {asset.industry || ('exchange' in asset ? asset.exchange : '') || asset.category}
                            </div>
                          </div>
                        </div>
                        <PriceDisplay
                          symbol={asset.symbol}
                          price={asset.price}
                          change={asset.change}
                          changePercent={asset.changePercent}
                          category={asset.category}
                          size="sm"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                    找不到與「<span className="font-bold text-slate-900 dark:text-slate-100">{query}</span>」相關的資產
                  </div>
                )
              ) : (
                <div className="p-4">
                  {/* Recent Searches */}
                  {searchHistory.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> 最近搜尋
                        </span>
                        <Link
                          href="/my-market/search-history"
                          onClick={() => setIsOpenDropdown(false)}
                          className="text-brand-600 dark:text-brand-400 hover:underline text-[11px]"
                        >
                          管理歷史
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {searchHistory.slice(0, 5).map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setQuery(item.query);
                              router.push(`/search?q=${encodeURIComponent(item.query)}`);
                              setIsOpenDropdown(false);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono transition-colors"
                          >
                            {item.symbol || item.query}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hot Popular Suggestions */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-2">熱門搜尋標的</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { symbol: '2330', name: '台積電', cat: 'stock' },
                        { symbol: 'NVDA', name: '輝達', cat: 'stock' },
                        { symbol: 'BTC', name: '比特幣', cat: 'crypto' },
                        { symbol: '0050', name: '元大台灣50', cat: 'etf' },
                        { symbol: 'USD/TWD', name: '美元/新台幣', cat: 'forex' },
                      ].map(item => (
                        <button
                          key={item.symbol}
                          onClick={() => {
                            setQuery(item.symbol);
                            router.push(`/search?q=${encodeURIComponent(item.symbol)}`);
                            setIsOpenDropdown(false);
                          }}
                          className="px-3 py-2 rounded-xl text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.symbol}</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Notifications, Theme, Settings, User Menu */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Notifications Button */}
          <Link
            href="/my-market/notifications"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="通知中心"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? '切換為淺色模式' : '切換為深色模式'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Quick Settings Link */}
          <Link
            href="/settings"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex"
            title="偏好設定"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Link>

          {/* User Avatar */}
          <div className="pl-1 border-l border-slate-200 dark:border-slate-800 ml-1">
            <Link
              href="/settings"
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:ring-2 hover:ring-brand-500/50 transition-all"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
