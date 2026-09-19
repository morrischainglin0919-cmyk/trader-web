'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { allAssets as initialAssets } from '@/data';
import { AnyAsset } from '@/types/asset';
import { Watchlist } from '@/types/watchlist';
import { Alert } from '@/types/alert';
import { Notification } from '@/types/notification';

export interface SearchHistoryItem {
  id: string;
  query: string;
  symbol?: string;
  name?: string;
  timestamp: string;
}

interface AppContextType {
  // Assets & Real-time simulation tick
  assets: AnyAsset[];
  lastTickTime: string;
  recentlyTickedSymbols: Record<string, 'up' | 'down'>;
  
  // Watchlist
  watchlists: Watchlist[];
  activeWatchlistId: string;
  setActiveWatchlistId: (id: string) => void;
  createWatchlist: (name: string) => void;
  renameWatchlist: (id: string, newName: string) => void;
  deleteWatchlist: (id: string) => void;
  addToWatchlist: (symbol: string, listId?: string) => void;
  removeFromWatchlist: (symbol: string, listId?: string) => void;
  isInWatchlist: (symbol: string, listId?: string) => boolean;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;

  // Search History
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (query: string, symbol?: string, name?: string) => void;
  deleteSearchHistory: (id: string) => void;
  clearSearchHistory: () => void;

  // Settings & Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  colorRule: 'TW' | 'US';
  setColorRule: (rule: 'TW' | 'US') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialWatchlists: Watchlist[] = [
  {
    id: 'wl-default',
    name: '核心追蹤',
    isDefault: true,
    symbols: ['2330', 'NVDA', '0050', 'BTC', 'USD/TWD'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wl-tw',
    name: '台股精選',
    symbols: ['2330', '2454', '2317', '2382', '2881'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wl-us',
    name: '美股科技',
    symbols: ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'TSLA'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wl-etf',
    name: '高股息 ETF',
    symbols: ['00878', '00919', '00929', '0050', 'SPY'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wl-crypto',
    name: '加密資產',
    symbols: ['BTC', 'ETH', 'SOL'],
    createdAt: new Date().toISOString(),
  },
];

const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    symbol: 'NVDA',
    assetName: '輝達',
    category: 'price',
    operator: 'less_than',
    targetValue: 130,
    currentValue: 132.8,
    enabled: true,
    createdAt: '2026-09-15 10:00',
    note: '等待客觀觀察點位',
  },
  {
    id: 'alert-2',
    symbol: '2330',
    assetName: '台積電',
    category: 'price',
    operator: 'greater_than',
    targetValue: 1000,
    currentValue: 985,
    enabled: true,
    createdAt: '2026-09-16 14:20',
    note: '千元心理關卡提醒',
  },
  {
    id: 'alert-3',
    symbol: 'BTC',
    assetName: '比特幣',
    category: 'change',
    operator: 'greater_than',
    targetValue: 5,
    currentValue: 2.96,
    enabled: false,
    createdAt: '2026-09-18 09:15',
    note: '單日波動放大提醒',
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: '市場條件提醒觸發',
    message: 'NVDA 輝達價格已接近您設定的目標區間 (130 USD)',
    timestamp: '10 分鐘前',
    read: false,
    relatedSymbol: 'NVDA',
  },
  {
    id: 'notif-2',
    type: 'system',
    title: '歡迎使用全球金融資訊與學習平台',
    message: '您可以查看即時模擬行情、技術 K 線圖、設定客觀條件提醒與進行歷史情境模擬。',
    timestamp: '1 小時前',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'news',
    title: '重大市場新聞更新',
    message: '台積電先進製程產能利用率持續衝高，點擊查看詳細解析。',
    timestamp: '3 小時前',
    read: true,
    relatedSymbol: '2330',
  },
];

const initialSearchHistory: SearchHistoryItem[] = [
  { id: 'sh-1', query: '2330', symbol: '2330', name: '台積電', timestamp: '10 分鐘前' },
  { id: 'sh-2', query: 'NVDA', symbol: 'NVDA', name: '輝達', timestamp: '30 分鐘前' },
  { id: 'sh-3', query: 'BTC', symbol: 'BTC', name: '比特幣', timestamp: '2 小時前' },
  { id: 'sh-4', query: '0050', symbol: '0050', name: '元大台灣50', timestamp: '昨天' },
  { id: 'sh-5', query: 'USD/TWD', symbol: 'USD/TWD', name: '美元/新台幣', timestamp: '3 天前' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<AnyAsset[]>(initialAssets);
  const [lastTickTime, setLastTickTime] = useState<string>('');
  const [recentlyTickedSymbols, setRecentlyTickedSymbols] = useState<Record<string, 'up' | 'down'>>({});
  
  const [watchlists, setWatchlists] = useState<Watchlist[]>(initialWatchlists);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>('wl-default');
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(initialSearchHistory);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [colorRule, setColorRule] = useState<'TW' | 'US'>('TW');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Apply dark mode class to document HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Real-time Market Data Simulation (Tick every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLastTickTime(timeStr);

      // Randomly pick 3 to 6 assets to tick slightly
      const countToUpdate = Math.floor(Math.random() * 4) + 3;
      const tickedIndices: number[] = [];
      while (tickedIndices.length < countToUpdate) {
        const idx = Math.floor(Math.random() * initialAssets.length);
        if (!tickedIndices.includes(idx)) tickedIndices.push(idx);
      }

      const flashMap: Record<string, 'up' | 'down'> = {};

      setAssets(prevAssets =>
        prevAssets.map((asset, index) => {
          if (!tickedIndices.includes(index)) return asset;

          const pctChange = (Math.random() - 0.49) * 0.006; // +/- 0.3% tick
          const priceDiff = asset.price * pctChange;
          const newPrice = Math.max(asset.price + priceDiff, 0.01);
          const newChange = asset.change + priceDiff;
          const newChangePercent = ((newPrice - asset.previousClose) / asset.previousClose) * 100;

          flashMap[asset.symbol] = priceDiff >= 0 ? 'up' : 'down';

          return {
            ...asset,
            price: Number(newPrice.toFixed(asset.category === 'crypto' || asset.category === 'forex' ? 4 : 2)),
            change: Number(newChange.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2)),
            high: Math.max(asset.high, newPrice),
            low: Math.min(asset.low, newPrice),
            lastUpdated: timeStr,
          };
        })
      );

      setRecentlyTickedSymbols(flashMap);

      // Clear visual flash after 1 second
      setTimeout(() => {
        setRecentlyTickedSymbols({});
      }, 1200);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Watchlist Actions
  const createWatchlist = (name: string) => {
    const newList: Watchlist = {
      id: `wl-${Date.now()}`,
      name,
      symbols: [],
      createdAt: new Date().toISOString(),
    };
    setWatchlists(prev => [...prev, newList]);
    setActiveWatchlistId(newList.id);
  };

  const renameWatchlist = (id: string, newName: string) => {
    setWatchlists(prev =>
      prev.map(l => (l.id === id ? { ...l, name: newName } : l))
    );
  };

  const deleteWatchlist = (id: string) => {
    setWatchlists(prev => prev.filter(l => l.id !== id || l.isDefault));
    if (activeWatchlistId === id) setActiveWatchlistId('wl-default');
  };

  const addToWatchlist = (symbol: string, listId?: string) => {
    const targetId = listId || activeWatchlistId;
    setWatchlists(prev =>
      prev.map(l => {
        if (l.id === targetId) {
          if (!l.symbols.includes(symbol)) {
            return { ...l, symbols: [...l.symbols, symbol] };
          }
        }
        return l;
      })
    );
  };

  const removeFromWatchlist = (symbol: string, listId?: string) => {
    const targetId = listId || activeWatchlistId;
    setWatchlists(prev =>
      prev.map(l => {
        if (l.id === targetId) {
          return { ...l, symbols: l.symbols.filter(s => s !== symbol) };
        }
        return l;
      })
    );
  };

  const isInWatchlist = (symbol: string, listId?: string) => {
    const targetId = listId || activeWatchlistId;
    const list = watchlists.find(l => l.id === targetId);
    return list ? list.symbols.includes(symbol) : false;
  };

  // Alerts Actions
  const addAlert = (newAlertData: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Notifications Actions
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Search History Actions
  const addSearchHistory = (query: string, symbol?: string, name?: string) => {
    if (!query.trim()) return;
    const newItem: SearchHistoryItem = {
      id: `sh-${Date.now()}`,
      query,
      symbol,
      name,
      timestamp: '剛剛',
    };
    setSearchHistory(prev => [newItem, ...prev.filter(item => item.query !== query)]);
  };

  const deleteSearchHistory = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        assets,
        lastTickTime,
        recentlyTickedSymbols,
        watchlists,
        activeWatchlistId,
        setActiveWatchlistId,
        createWatchlist,
        renameWatchlist,
        deleteWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        alerts,
        addAlert,
        toggleAlert,
        deleteAlert,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        searchHistory,
        addSearchHistory,
        deleteSearchHistory,
        clearSearchHistory,
        theme,
        toggleTheme,
        colorRule,
        setColorRule,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
