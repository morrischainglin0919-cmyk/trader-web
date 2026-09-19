import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import LayoutWrapper from './LayoutWrapper';

export const metadata: Metadata = {
  title: '全球金融市場資訊與學習平台 | Global Financial Market & Learning Platform',
  description: '專業全球金融市場資訊與學習平台：即時模擬行情、技術 K 線圖表、數據統計比較、客觀條件提醒與歷史情境模擬。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <AppProvider>
          <Header />
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
