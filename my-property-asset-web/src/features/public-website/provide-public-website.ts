import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { CookieConsentService } from './services/cookie-consent.service';
import { ConversionAttributionService } from './services/conversion-attribution.service';
import { PublicAnalyticsService } from './services/public-analytics.service';

export function providePublicWebsite(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const cookieConsent = inject(CookieConsentService);
      const analytics = inject(PublicAnalyticsService);
      const attribution = inject(ConversionAttributionService);
      const router = inject(Router);

      cookieConsent.initialize();
      analytics.initialize();
      attribution.initialize();

      router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        attribution.captureFromUrl(router.url);
        analytics.trackPageView(router.url);
      });
    }),
  ]);
}
