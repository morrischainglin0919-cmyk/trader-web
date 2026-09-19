'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Settings, Moon, Sun, Palette, Bell, Globe, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, colorRule, setColorRule } = useApp();
  const [activeSection, setActiveSection] = useState<'display' | 'account' | 'notifications' | 'language'>('display');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-7 h-7 text-brand-500" /> 偏好與平台設定
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          客制化您的主題外態、色彩顯示習慣（紅漲綠跌 vs 綠漲紅跌）與通知設定。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side Navigation */}
        <div className="space-y-1">
          {[
            { key: 'display', label: '顯示與色彩設定', icon: <Palette className="w-4 h-4" /> },
            { key: 'account', label: '帳戶與偏好', icon: <User className="w-4 h-4" /> },
            { key: 'notifications', label: '通知設定', icon: <Bell className="w-4 h-4" /> },
            { key: 'language', label: '語言與地區', icon: <Globe className="w-4 h-4" /> },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeSection === item.key
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Settings Form Content */}
        <div className="md:col-span-3 space-y-6">
          {activeSection === 'display' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Palette className="w-5 h-5 text-brand-500" /> 介面主題與色彩喜好
              </h3>

              {/* Theme Mode Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  深淺主題切換 (預設為專業深色模式)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={toggleTheme}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      theme === 'dark'
                        ? 'border-brand-500 bg-slate-800 text-white ring-2 ring-brand-500/30'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Moon className="w-6 h-6 text-indigo-400" />
                    <div>
                      <div className="font-bold text-sm">深色金融風格 (Dark)</div>
                      <div className="text-xs opacity-75">適合長時觀測與低光調</div>
                    </div>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      theme === 'light'
                        ? 'border-brand-500 bg-white text-slate-900 ring-2 ring-brand-500/30'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <Sun className="w-6 h-6 text-amber-500" />
                    <div>
                      <div className="font-bold text-sm">明亮風格 (Light)</div>
                      <div className="text-xs opacity-75">清晰高對比圖表閱讀</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Color Rule Standard */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  漲跌色彩規範習慣
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setColorRule('TW')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      colorRule === 'TW'
                        ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 text-red-600 dark:text-red-400 ring-2 ring-red-500/30 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">台股標準「紅漲綠跌」</div>
                      <div className="text-xs opacity-75">台灣/中港金融習慣</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setColorRule('US')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      colorRule === 'US'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">美股 / 國際「綠漲紅跌」</div>
                      <div className="text-xs opacity-75">歐美/加密貨幣通用</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'display' && (
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-400 text-sm">
              此偏好項已採用系統最佳預設設定（繁體中文 / 本地靜態個人化）。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
