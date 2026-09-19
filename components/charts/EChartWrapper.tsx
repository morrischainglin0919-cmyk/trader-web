'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[250px] flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-slate-400 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <span>載入行情圖表...</span>
      </div>
    </div>
  ),
});

interface EChartWrapperProps {
  option: any;
  style?: React.CSSProperties;
  className?: string;
  onEvents?: Record<string, Function>;
}

export const EChartWrapper: React.FC<EChartWrapperProps> = ({
  option,
  style = { height: '350px', width: '100%' },
  className = '',
  onEvents,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full min-h-[250px] flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/40 rounded-xl ${className}`}>
        <span className="text-slate-400 text-sm">圖表準備中...</span>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${className}`}>
      <ReactECharts
        option={option}
        style={style}
        onEvents={onEvents}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
