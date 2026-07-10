export type FeedbackSeverity = 'info' | 'success' | 'warn' | 'error' | 'secondary' | 'contrast';

export type FeedbackStateVariant =
  | 'empty'
  | 'no-data'
  | 'error'
  | 'success'
  | 'maintenance'
  | 'loading';

export interface FeedbackStateConfig {
  title: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
}
