'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Home,
  Globe,
  TrendingUp,
  PieChart,
  Coins,
  DollarSign,
  Newspaper,
  Bookmark,
  Wrench,
  Calculator,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface NavGroupItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: { name: string; href: string }[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, unreadCount } = useApp();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    markets: false,
    stocks: false,
    etf: false,
    crypto: false,
    forex: false,
    myMarket: false,
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navGroups: { section: string; items: NavGroupItem[] }[] = [
    {
      section: '行情資訊',
      items: [
        {
          name: '首頁 Dashboard',
          href: '/',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: '全球市場',
          href: '/markets',
          icon: <Globe className="w-5 h-5" />,
          children: [
            { name: '全球市場總覽', href: '/markets' },
            { name: '台灣市場', href: '/markets?region=TW' },
            { name: '美國市場', href: '/markets?region=US' },
            { name: '亞洲市場', href: '/markets?region=ASIA' },
            { name: '歐洲市場', href: '/markets?region=EU' },
          ],
        },
        {
          name: '股票市場',
          href: '/stocks',
          icon: <TrendingUp className="w-5 h-5" />,
          children: [
            { name: '台股總覽', href: '/stocks/taiwan' },
            { name: '美股總覽', href: '/stocks/us' },
            { name: '股票排行榜', href: '/stocks/rankings' },
            { name: '股票進階搜尋', href: '/stocks/search' },
            { name: '股票數據比較', href: '/stocks/compare' },
          ],
        },
        {
          name: 'ETF 基金',
          href: '/etf',
          icon: <PieChart className="w-5 h-5" />,
          children: [
            { name: '台股 ETF', href: '/etf/taiwan' },
            { name: '美股 ETF', href: '/etf/us' },
            { name: 'ETF 排行榜', href: '/etf/rankings' },
            { name: 'ETF 搜尋', href: '/etf/search' },
            { name: 'ETF 比較', href: '/etf/compare' },
          ],
        },
        {
          name: '加密貨幣',
          href: '/crypto',
          icon: <Coins className="w-5 h-5" />,
          children: [
            { name: '加密貨幣總覽', href: '/crypto' },
            { name: '幣種市值排行', href: '/crypto/rankings' },
            { name: '24H 漲幅榜', href: '/crypto/gainers' },
            { name: '24H 跌幅榜', href: '/crypto/losers' },
            { name: '成交量排行', href: '/crypto/volume' },
            { name: '幣種搜尋', href: '/crypto/search' },
          ],
        },
        {
          name: '外匯匯率',
          href: '/forex',
          icon: <DollarSign className="w-5 h-5" />,
          children: [
            { name: '外匯總覽', href: '/forex' },
            { name: '主要貨幣對', href: '/forex/pairs' },
            { name: '全球貨幣列表', href: '/forex/currencies' },
            { name: '匯率排行榜', href: '/forex/rankings' },
            { name: '外匯數據比較', href: '/forex/compare' },
          ],
        },
        {
          name: '市場新聞',
          href: '/news',
          icon: <Newspaper className="w-5 h-5" />,
        },
      ],
    },
    {
      section: '個人工具',
      items: [
        {
          name: '我的市場',
          href: '/my-market/watchlist',
          icon: <Bookmark className="w-5 h-5" />,
          badge: unreadCount > 0 ? `${unreadCount}` : undefined,
          children: [
            { name: '我的觀察清單', href: '/my-market/watchlist' },
            { name: '搜尋歷史紀錄', href: '/my-market/search-history' },
            { name: '我的市場提醒', href: '/my-market/alerts' },
            { name: '通知中心', href: '/my-market/notifications' },
          ],
        },
        {
          name: '資料工具',
          href: '/tools',
          icon: <Wrench className="w-5 h-5" />,
        },
        {
          name: '投資情境模擬',
          href: '/simulator',
          icon: <Calculator className="w-5 h-5 text-amber-500" />,
        },
        {
          name: '學習中心',
          href: '/learn',
          icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
        },
      ],
    },
    {
      section: '系統管理',
      items: [
        {
          name: '偏好與帳戶設定',
          href: '/settings',
          icon: <Settings className="w-5 h-5" />,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between overflow-y-auto ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="py-4 px-2 space-y-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {sidebarOpen && (
              <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {group.section}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const keyName = item.name.toLowerCase();
                const hasChildren = item.children && item.children.length > 0;
                const isSubOpen = openSubmenus[keyName] || isActive;

                return (
                  <div key={itemIdx}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                        title={!sidebarOpen ? item.name : undefined}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {sidebarOpen && (
                          <span className="truncate flex-1">{item.name}</span>
                        )}
                        {sidebarOpen && item.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>

                      {sidebarOpen && hasChildren && (
                        <button
                          onClick={() => toggleSubmenu(keyName)}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          {isSubOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Submenu links */}
                    {sidebarOpen && hasChildren && isSubOpen && (
                      <div className="ml-7 pl-3 border-l border-slate-200 dark:border-slate-800 mt-1 space-y-1">
                        {item.children?.map((child, childIdx) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={childIdx}
                              href={child.href}
                              className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                isChildActive
                                  ? 'text-brand-600 dark:text-brand-400 font-bold bg-brand-50/50 dark:bg-brand-950/40'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Disclaimer Banner */}
      {sidebarOpen && (
        <div className="p-3 m-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> 學習觀測平台
          </div>
          本站僅提供行情展示與歷史模擬，無任何交易或建議功能。
        </div>
      )}
    </aside>
  );
};
