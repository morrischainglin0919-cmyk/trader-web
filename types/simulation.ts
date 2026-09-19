export interface SimulationConfig {
  symbol: string;
  initialAmount: number;
  startDate: string;
  endDate: string;
}

export interface SimulationResultPoint {
  date: string;
  price: number;
  portfolioValue: number;
  returnPercent: number;
}

export interface SimulationResult {
  symbol: string;
  assetName: string;
  initialAmount: number;
  finalAmount: number;
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturnPercent: number;
  maxDrawdownPercent: number;
  maxGainPercent: number;
  holdingDays: number;
  chartData: SimulationResultPoint[];
}
