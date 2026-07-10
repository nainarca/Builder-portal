export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit?: string;
  timestamp?: number;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  identify?(userId: string, traits?: Record<string, unknown>): void;
}

export interface TelemetryProvider {
  trackMetric(metric: PerformanceMetric): void;
  trackTrace(message: string, properties?: Record<string, unknown>): void;
  trackException(error: unknown, properties?: Record<string, unknown>): void;
}

export interface UsageTrackingProvider {
  trackPageView(path: string, properties?: Record<string, unknown>): void;
  trackAction(action: string, properties?: Record<string, unknown>): void;
}
