'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-6 mt-12 transition-colors">
      <div className="max-w-7xl mx-mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-base text-slate-900 dark:text-slate-100">
              全球金融市場資訊與學習平台
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 max-w-xl">
            本平台旨在提供乾淨、客觀且專業的全球金融行情資訊導覽、數據統計工具、技術圖表展示與歷史投資情境模擬。
          </p>
          <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-2.5 rounded-lg max-w-xl">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              聲明：本站不涉及真實資金交易、不連接券商/銀行下單、不提供個人化投資建議。所有行情數據均為模擬展示。
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">行情數據分類</h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li><Link href="/stocks/taiwan" className="hover:text-brand-500">台灣股票 (TAIEX)</Link></li>
            <li><Link href="/stocks/us" className="hover:text-brand-500">美國股票 (S&P 500 / NASDAQ)</Link></li>
            <li><Link href="/etf" className="hover:text-brand-500">指數型與高股息 ETF</Link></li>
            <li><Link href="/crypto" className="hover:text-brand-500">24H 加密貨幣市場</Link></li>
            <li><Link href="/forex" className="hover:text-brand-500">全球主要外匯匯率</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">工具與學習資源</h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li><Link href="/tools" className="hover:text-brand-500">多資產數據比較工具</Link></li>
            <li><Link href="/simulator" className="hover:text-brand-500">歷史情境回測模擬器</Link></li>
            <li><Link href="/my-market/alerts" className="hover:text-brand-500">客觀條件市場提醒</Link></li>
            <li><Link href="/learn" className="hover:text-brand-500">金融基礎與 K 線教學</Link></li>
            <li><Link href="/settings" className="hover:text-brand-500">色彩偏好與顯示設定</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>© 2026 全球金融市場資訊與學習平台. All rights reserved. (MVP Demo Architecture)</div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px]">Next.js App Router • ECharts • Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
};
