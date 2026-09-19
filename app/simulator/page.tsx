'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { EChartWrapper } from '@/components/charts/EChartWrapper';
import { generateHistoricalPoints } from '@/data';
import { formatPrice } from '@/lib/utils';
import { Calculator, ShieldAlert, Sparkles, TrendingUp, TrendingDown, ArrowDownRight } from 'lucide-react';

export default function SimulatorPage() {
  const { assets, theme, colorRule } = useApp();
  const [selectedSymbol, setSelectedSymbol] = useState('2330');
  const [initialAmount, setInitialAmount] = useState('100000'); // $100,000 NTD or USD
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState(12); // 12 months

  const isDark = theme === 'dark';
  const asset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  const amountNum = parseFloat(initialAmount) || 100000;
  const historyPoints = generateHistoricalPoints(asset.price, holdingPeriodMonths * 30);
  const firstPrice = historyPoints[0]?.price || asset.price * 0.7;
  const lastPrice = historyPoints[historyPoints.length - 1]?.price || asset.price;

  // Calculate hypothetical simulation metrics
  const sharesBought = amountNum / firstPrice;
  const finalPortfolioValue = sharesBought * lastPrice;
  const totalReturn = finalPortfolioValue - amountNum;
  const totalReturnPercent = ((finalPortfolioValue - amountNum) / amountNum) * 100;

  // Calculate Max Drawdown (MDD)
  let maxPriceSoFar = -Infinity;
  let maxDrawdown = 0;
  let maxGain = 0;

  historyPoints.forEach(p => {
    if (p.price > maxPriceSoFar) {
      maxPriceSoFar = p.price;
    }
    const drawdown = ((maxPriceSoFar - p.price) / maxPriceSoFar) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
    const gainFromStart = ((p.price - firstPrice) / firstPrice) * 100;
    if (gainFromStart > maxGain) {
      maxGain = gainFromStart;
    }
  });

  const chartData = historyPoints.map(p => {
    const value = sharesBought * p.price;
    return {
      date: p.timestamp,
      value: Number(value.toFixed(0)),
    };
  });

  const isUp = totalReturnPercent >= 0;
  const lineColor = isUp
    ? colorRule === 'TW' ? '#ef4444' : '#10b981'
    : colorRule === 'TW' ? '#10b981' : '#ef4444';

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: `假設投資 ${asset.name} (${asset.symbol}) 歷史資產價值變化`,
      left: 'center',
      top: 10,
      textStyle: {
        color: isDark ? '#f8fafc' : '#0f172a',
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: isDark ? '#f8fafc' : '#0f172a' },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <div style="font-family: monospace;">
            <div style="color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 11px;">${item.name}</div>
            <div style="font-weight: bold; font-size: 14px; color: ${lineColor};">
              假設組合總值: $${Number(item.value).toLocaleString()}
            </div>
          </div>
        `;
      },
    },
    grid: { left: '4%', right: '4%', bottom: '10%', top: '18%', containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.map(c => c.date),
      axisLine: { lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: 11,
        formatter: (val: number) => `$${val.toLocaleString()}`,
      },
    },
    series: [
      {
        name: '模擬組合價值',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: lineColor, width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${lineColor}40` },
              { offset: 1, color: `${lineColor}00` },
            ],
          },
        },
        data: chartData.map(c => c.value),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calculator className="w-7 h-7 text-amber-500" /> 歷史投資情境模擬器
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/30">
            教育用途回測
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          設定假設投入金額與持有區間，試算歷史股價變動下的假設持有結果與最大回撤 (MDD)。
        </p>
      </div>

      {/* Mandatory Regulatory Disclaimer Alert Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-300">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">重要法律聲明：</span>
          本功能僅供歷史資料試算與教育展示用途，不涉及任何真實資金交易、下單操作或券商連線。過去的歷史表現不代表未來的收益保證。
        </div>
      </div>

      {/* Simulator Inputs Configuration Panel */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> 模擬參數設定
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              選擇假設持有標的
            </label>
            <select
              value={selectedSymbol}
              onChange={e => setSelectedSymbol(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 font-sans"
            >
              {assets.slice(0, 15).map(a => (
                <option key={a.symbol} value={a.symbol}>
                  {a.name} ({a.symbol}) - ${a.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              假設初始投入金額 ($)
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={e => setInitialAmount(e.target.value)}
              step="10000"
              className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              假設持有時間長度
            </label>
            <select
              value={holdingPeriodMonths}
              onChange={e => setHoldingPeriodMonths(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 font-sans"
            >
              <option value={3}>3 個月 (短期持有)</option>
              <option value={6}>6 個月 (中期回測)</option>
              <option value={12}>12 個月 (1年長線)</option>
              <option value={24}>24 個月 (2年長期)</option>
              <option value={36}>36 個月 (3年循環)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Simulation Result Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs font-sans text-slate-400">假設期末資產總值</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            ${finalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs font-sans text-slate-400">假設總報酬率 (%)</span>
          <div className={`text-xl font-bold mt-1 ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
            {totalReturnPercent > 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs font-sans text-slate-400">期間最大上漲波段</span>
          <div className="text-xl font-bold text-red-500 mt-1">
            +{maxGain.toFixed(2)}%
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs font-sans text-slate-400">最大回撤 (Max Drawdown)</span>
          <div className="text-xl font-bold text-emerald-500 mt-1">
            -{maxDrawdown.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Simulation Result Line Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <EChartWrapper option={option} style={{ height: '380px', width: '100%' }} />
      </div>
    </div>
  );
}
