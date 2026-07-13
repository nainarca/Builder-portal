import { Injectable, inject } from '@angular/core';

import { AnalyticsService } from '../../../infrastructure/analytics/services/analytics.service';
import { CookieConsentService } from './cookie-consent.service';
import { ConversionAnalyticsEvent } from '../models/conversion.model';

@Injectable({ providedIn: 'root' })
export class ConversionAnalyticsService {
  private readonly analytics = inject(AnalyticsService);
  private readonly cookieConsent = inject(CookieConsentService);

  trackConversion(event: ConversionAnalyticsEvent): void {
    if (!this.cookieConsent.hasAnalyticsConsent()) {
      return;
    }

    this.analytics.trackAction(event.name, {
      surface: event.surface,
      intent: event.intent,
      returnUrl: event.returnUrl,
      ...event.attribution,
    });

    this.analytics.track({
      name: event.name,
      properties: {
        surface: event.surface,
        intent: event.intent,
        returnUrl: event.returnUrl,
        ...event.attribution,
      },
    });
  }
}
