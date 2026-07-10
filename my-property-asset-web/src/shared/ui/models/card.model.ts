export type CardVariant = 'default' | 'flat' | 'interactive' | 'outlined';
export type StatTrend = 'up' | 'down' | 'neutral';

export interface StatCardData {
  label: string;
  value: string;
  hint?: string;
  trend?: StatTrend;
  trendLabel?: string;
}
