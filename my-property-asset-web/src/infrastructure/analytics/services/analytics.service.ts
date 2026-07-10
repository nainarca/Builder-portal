import { Injectable } from '@angular/core';

import {
  AnalyticsEvent,
  AnalyticsProvider,
  PerformanceMetric,
  TelemetryProvider,
  UsageTrackingProvider,
} from '../models/analytics.model';

class NoOpAnalyticsProvider implements AnalyticsProvider {
  track(): void {
    // Future Google Analytics / product analytics integration point.
  }
}

class NoOpTelemetryProvider implements TelemetryProvider {
  trackMetric(): void {
    // Future Application Insights integration point.
  }

  trackTrace(): void {
    // Future Application Insights integration point.
  }

  trackException(): void {
    // Future Sentry integration point.
  }
}

class NoOpUsageTrackingProvider implements UsageTrackingProvider {
  trackPageView(): void {
    return undefined;
  }

  trackAction(): void {
    return undefined;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private provider: AnalyticsProvider = new NoOpAnalyticsProvider();
  private usageProvider: UsageTrackingProvider = new NoOpUsageTrackingProvider();

  registerProvider(provider: AnalyticsProvider): void {
    this.provider = provider;
  }

  registerUsageProvider(provider: UsageTrackingProvider): void {
    this.usageProvider = provider;
  }

  track(event: AnalyticsEvent): void {
    this.provider.track({
      ...event,
      timestamp: event.timestamp ?? Date.now(),
    });
  }

  trackPageView(path: string, properties?: Record<string, unknown>): void {
    this.usageProvider.trackPageView(path, properties);
  }

  trackAction(action: string, properties?: Record<string, unknown>): void {
    this.usageProvider.trackAction(action, properties);
  }
}

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private provider: TelemetryProvider = new NoOpTelemetryProvider();

  registerProvider(provider: TelemetryProvider): void {
    this.provider = provider;
  }

  trackMetric(metric: PerformanceMetric): void {
    this.provider.trackMetric({
      ...metric,
      timestamp: metric.timestamp ?? Date.now(),
    });
  }

  trackTrace(message: string, properties?: Record<string, unknown>): void {
    this.provider.trackTrace(message, properties);
  }

  trackException(error: unknown, properties?: Record<string, unknown>): void {
    this.provider.trackException(error, properties);
  }
}
