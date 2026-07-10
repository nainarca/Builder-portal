export type ErrorCategory =
  | 'validation'
  | 'network'
  | 'authorization'
  | 'data'
  | 'system'
  | 'unknown';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ClassifiedError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage?: string;
  retryable: boolean;
  correlationId?: string;
  original: unknown;
}

export interface ErrorBannerState {
  title: string;
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
  dismissible: boolean;
}

export interface ErrorDialogState {
  title: string;
  message: string;
  technicalDetail?: string;
  retryable: boolean;
}
