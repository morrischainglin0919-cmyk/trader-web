'use client';

import React, { useState } from 'react';
import { EChartWrapper } from './EChartWrapper';
import { useApp } from '@/lib/context/AppContext';
import { TimeRange } from '@/types/market';
import { generateHistoricalPoints } from '@/data';

interface AreaTrendChartProps {
  basePrice?: number;
  height?: string;
  title?: string;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  basePrice = 22420.5,
  height = '360px',
  title = '台灣加權指數 (TAIEX) 市場走勢',
}) => {
  const { theme, colorRule } = useApp();
  const [activeRange, setActiveRange] = useState<TimeRange>('1M');

  const rangeDaysMap: Record<TimeRange, number> = {
    '1D': 1,
    '5D': 5,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    'YTD': 260,
    '1Y': 365,
    '5Y': 1825,
    'ALL': 2500,
  };

  const points = generateHistoricalPoints(basePrice, rangeDaysMap[activeRange] || 30);
  const firstPrice = points[0]?.price || basePrice;
  const lastPrice = points[points.length - 1]?.price || basePrice;
  const isUp = lastPrice >= firstPrice;

  const isDark = theme === 'dark';
  const lineColor = isUp
    ? colorRule === 'TW' ? '#ef4444' : '#10b981'
    : colorRule === 'TW' ? '#10b981' : '#ef4444';

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '12%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: {
        color: isDark ? '#f8fafc' : '#0f172a',
      },
      formatter: function (params: any) {
        const item = params[0];
        return `
          <div style="font-family: monospace;">
            <div style="color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 12px; margin-bottom: 4px;">${item.name}</div>
            <div style="font-weight: bold; font-size: 15px; color: ${lineColor};">
              數值: ${Number(item.value).toLocaleString()}
            </div>
          </div>
        `;
      },
    },
    xAxis: {
      type: 'category',
      data: points.map(p => p.timestamp),
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: isDark ? '#334155' : '#cbd5e1',
        },
      },
      axisLabel: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: 11,
      },
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
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    series: [
      {
        name: '走勢數值',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: lineColor,
          width: 2.5,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: isUp
                  ? colorRule === 'TW' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'
                  : colorRule === 'TW' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
              },
              {
                offset: 1,
                color: 'rgba(0, 0, 0, 0)',
              },
            ],
          },
        },
        data: points.map(p => p.price),
      },
    ],
  };

  const ranges: { key: TimeRange; label: string }[] = [
    { key: '1D', label: '1日' },
    { key: '5D', label: '5日' },
    { key: '1M', label: '1個月' },
    { key: '3M', label: '3個月' },
    { key: '6M', label: '6個月' },
    { key: 'YTD', label: '年初至今' },
    { key: '1Y', label: '1年' },
    { key: '5Y', label: '5年' },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            區間變化: {(lastPrice - firstPrice).toFixed(2)} (
            {(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2)}%)
          </p>
        </div>

        {/* Range Selector Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-lg">
          {ranges.map(r => (
            <button
              key={r.key}
              onClick={() => setActiveRange(r.key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                activeRange === r.key
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <EChartWrapper option={option} style={{ height, width: '100%' }} />
    </div>
  );
};
