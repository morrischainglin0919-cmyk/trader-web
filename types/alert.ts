export type AlertCategory = 'all' | 'price' | 'change' | 'volume' | 'news' | 'index';
export type AlertOperator = 'less_than' | 'greater_than' | 'equal' | 'crosses_above' | 'crosses_below';

export interface Alert {
  id: string;
  symbol: string;
  assetName: string;
  category: AlertCategory;
  operator: AlertOperator;
  targetValue: number;
  currentValue: number;
  enabled: boolean;
  createdAt: string;
  lastTriggered?: string;
  note?: string;
}
