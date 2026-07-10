import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { CookieConsentService } from './services/cookie-consent.service';
import { PublicAnalyticsService } from './services/public-analytics.service';

export function providePublicWebsite(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const cookieConsent = inject(CookieConsentService);
      const analytics = inject(PublicAnalyticsService);
      const router = inject(Router);

      cookieConsent.initialize();
      analytics.initialize();

      router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        analytics.trackPageView(router.url);
      });
    }),
  ]);
}
