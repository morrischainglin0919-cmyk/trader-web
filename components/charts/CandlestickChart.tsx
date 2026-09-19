'use client';

import React, { useState } from 'react';
import { EChartWrapper } from './EChartWrapper';
import { useApp } from '@/lib/context/AppContext';
import { KLinePeriod, TimeRange } from '@/types/market';
import { generateKLinePoints } from '@/data';

interface CandlestickChartProps {
  symbol: string;
  assetName: string;
  basePrice?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol,
  assetName,
  basePrice = 985.0,
}) => {
  const { theme, colorRule } = useApp();
  const [activeType, setActiveType] = useState<'kline' | 'line'>('kline');
  const [activePeriod, setActivePeriod] = useState<KLinePeriod>('1d');
  const [activeRange, setActiveRange] = useState<TimeRange>('3M');

  const countMap: Record<TimeRange, number> = {
    '1D': 30,
    '5D': 60,
    '1M': 90,
    '3M': 120,
    '6M': 180,
    'YTD': 220,
    '1Y': 250,
    '5Y': 365,
    'ALL': 500,
  };

  const klines = generateKLinePoints(basePrice, countMap[activeRange] || 120);

  const isDark = theme === 'dark';
  // Color setup for candlestick bars
  const upColor = colorRule === 'TW' ? '#ef4444' : '#10b981';
  const downColor = colorRule === 'TW' ? '#10b981' : '#ef4444';

  const categoryData = klines.map(k => k.time);
  const candlestickData = klines.map(k => [k.open, k.close, k.low, k.high]);
  const volumeData = klines.map((k, index) => ({
    value: k.volume,
    itemStyle: {
      color: k.close >= k.open ? upColor : downColor,
    },
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: {
        color: isDark ? '#f8fafc' : '#0f172a',
      },
    },
    grid: [
      {
        left: '4%',
        right: '3%',
        top: '8%',
        height: '58%',
      },
      {
        left: '4%',
        right: '3%',
        top: '72%',
        height: '20%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: categoryData,
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false, lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
        axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 11 },
        splitLine: { show: false },
      },
      {
        type: 'category',
        gridIndex: 1,
        data: categoryData,
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false, lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        scale: true,
        splitLine: {
          lineStyle: {
            color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
            type: 'dashed',
          },
        },
        axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 11 },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 60,
        end: 100,
      },
    ],
    series: [
      activeType === 'kline'
        ? {
            name: `${symbol} K線`,
            type: 'candlestick',
            data: candlestickData,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upColor,
              borderColor0: downColor,
            },
          }
        : {
            name: `${symbol} 分時價格`,
            type: 'line',
            smooth: true,
            data: klines.map(k => k.close),
            lineStyle: { color: upColor, width: 2 },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: `${upColor}40` },
                  { offset: 1, color: `${upColor}00` },
                ],
              },
            },
          },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData,
      },
    ],
  };

  const periods: { key: KLinePeriod; label: string }[] = [
    { key: '1m', label: '1分' },
    { key: '5m', label: '5分' },
    { key: '15m', label: '15分' },
    { key: '30m', label: '30分' },
    { key: '1h', label: '1小時' },
    { key: '4h', label: '4小時' },
    { key: '1d', label: '日K' },
    { key: '1w', label: '週K' },
    { key: '1M', label: '月K' },
  ];

  const ranges: { key: TimeRange; label: string }[] = [
    { key: '1D', label: '1日' },
    { key: '5D', label: '5日' },
    { key: '1M', label: '1月' },
    { key: '3M', label: '3月' },
    { key: '6M', label: '6月' },
    { key: '1Y', label: '1年' },
    { key: '5Y', label: '5年' },
    { key: 'ALL', label: '全部' },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      {/* Top Chart Toolbar */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {symbol} {assetName} - 技術圖表
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              ECharts 技術組態
            </span>
          </div>

          {/* Type Toggle: K-line vs Line */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveType('kline')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeType === 'kline'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              K 線圖
            </button>
            <button
              onClick={() => setActiveType('line')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeType === 'line'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              分時折線圖
            </button>
          </div>
        </div>

        {/* Period & Range Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Period selector */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1">週期:</span>
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => setActivePeriod(p.key)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                  activePeriod === p.key
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Time range selector */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1">時間:</span>
            {ranges.map(r => (
              <button
                key={r.key}
                onClick={() => setActiveRange(r.key)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                  activeRange === r.key
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <EChartWrapper option={option} style={{ height: '420px', width: '100%' }} />
    </div>
  );
};
