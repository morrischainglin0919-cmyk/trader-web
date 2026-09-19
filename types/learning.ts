export type LearningCategory = 
  | 'stock_basics'
  | 'etf_101'
  | 'kline_guide'
  | 'fundamentals'
  | 'technical_analysis'
  | 'crypto'
  | 'forex'
  | 'risk_management';

export interface LearningLesson {
  id: string;
  title: string;
  category: LearningCategory;
  categoryName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTimeMinutes: number;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
}
