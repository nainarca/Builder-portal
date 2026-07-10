import { Injectable, inject, signal } from '@angular/core';

import { AnalyticsService } from '@infrastructure/analytics';
import { CookieConsentService } from './cookie-consent.service';

@Injectable({ providedIn: 'root' })
export class PublicAnalyticsService {
  private readonly analytics = inject(AnalyticsService);
  private readonly cookieConsent = inject(CookieConsentService);

  private readonly initialized = signal(false);

  initialize(): void {
    if (this.initialized()) {
      return;
    }

    this.initialized.set(true);
  }

  trackPageView(path: string, properties?: Record<string, unknown>): void {
    if (!this.canTrack()) {
      return;
    }

    this.analytics.trackPageView(path, {
      surface: 'public-website',
      ...properties,
    });
  }

  trackCta(action: string, properties?: Record<string, unknown>): void {
    if (!this.canTrack()) {
      return;
    }

    this.analytics.trackAction(action, {
      surface: 'public-website',
      ...properties,
    });

    this.analytics.track({
      name: action,
      properties: {
        surface: 'public-website',
        ...properties,
      },
    });
  }

  private canTrack(): boolean {
    return this.cookieConsent.hasAnalyticsConsent();
  }
}
