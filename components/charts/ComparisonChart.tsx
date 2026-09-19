'use client';

import React from 'react';
import { EChartWrapper } from './EChartWrapper';
import { useApp } from '@/lib/context/AppContext';
import { AnyAsset } from '@/types/asset';
import { generateHistoricalPoints } from '@/data';

interface ComparisonChartProps {
  assets: AnyAsset[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ assets }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  if (!assets || assets.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-sm">
        請至少選擇 1 至 5 個資產進行歷史趨勢比較
      </div>
    );
  }

  const colorPalette = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  const historyPointsCount = 90; // 3 months

  // Normalize all assets to 0% change starting at index 0
  const seriesData = assets.map((asset, index) => {
    const rawPoints = generateHistoricalPoints(asset.price, historyPointsCount);
    const startPrice = rawPoints[0].price || 1;
    const normalizedData = rawPoints.map(p => {
      const pctChange = ((p.price - startPrice) / startPrice) * 100;
      return Number(pctChange.toFixed(2));
    });

    return {
      name: `${asset.symbol} (${asset.name})`,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 2.5,
        color: colorPalette[index % colorPalette.length],
      },
      itemStyle: {
        color: colorPalette[index % colorPalette.length],
      },
      data: normalizedData,
    };
  });

  const dates = generateHistoricalPoints(100, historyPointsCount).map(p => p.timestamp);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '歷史相對漲跌幅走勢比較 (%)',
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
      textStyle: {
        color: isDark ? '#f8fafc' : '#0f172a',
      },
      formatter: (params: any) => {
        let res = `<div style="font-size: 12px; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 4px;">${params[0].name}</div>`;
        params.forEach((item: any) => {
          const val = Number(item.value);
          const color = item.color;
          const sign = val > 0 ? '+' : '';
          res += `
            <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 2px;">
              <span style="color: ${color}; font-weight: 500;">${item.seriesName}:</span>
              <span style="font-family: monospace; font-weight: bold; color: ${val >= 0 ? '#ef4444' : '#10b981'};">${sign}${val.toFixed(2)}%</span>
            </div>
          `;
        });
        return res;
      },
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: 12,
      },
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '15%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: 11,
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
          type: 'dashed',
        },
      },
    },
    series: seriesData,
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <EChartWrapper option={option} style={{ height: '380px', width: '100%' }} />
    </div>
  );
};
