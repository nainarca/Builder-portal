import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { APP_ROUTES } from '@core/constants/app.constants';
import { AUTH_QUERY_PARAMS, AUTH_ROUTE_SEGMENTS } from '@core/auth/constants/auth.constants';
import { AuthEntryIntent, ConversionAnalyticsEvent } from '../models/conversion.model';
import { ConversionAttributionService } from './conversion-attribution.service';
import { ConversionAnalyticsService } from './conversion-analytics.service';

export interface AuthLoginLinkOptions {
  readonly returnUrl?: string;
  readonly intent?: AuthEntryIntent;
}

@Injectable({ providedIn: 'root' })
export class ConversionNavigationService {
  private readonly router = inject(Router);
  private readonly attribution = inject(ConversionAttributionService);
  private readonly analytics = inject(ConversionAnalyticsService);

  buildAuthLoginLink(options: AuthLoginLinkOptions = {}): {
    route: string[];
    queryParams: Record<string, string>;
  } {
    const queryParams: Record<string, string> = {
      ...this.attribution.buildQueryParams(),
    };

    const returnUrl = options.returnUrl ?? this.router.url.split('?')[0];
    if (returnUrl && returnUrl !== '/' && !returnUrl.startsWith('/auth')) {
      queryParams[AUTH_QUERY_PARAMS.returnUrl] = returnUrl;
    }

    if (options.intent) {
      queryParams[AUTH_QUERY_PARAMS.intent] = options.intent;
    }

    return {
      route: ['/', APP_ROUTES.authentication, AUTH_ROUTE_SEGMENTS.login],
      queryParams,
    };
  }

  async navigateToAuthLogin(options: AuthLoginLinkOptions = {}): Promise<void> {
    const link = this.buildAuthLoginLink(options);
    await this.router.navigate(link.route, { queryParams: link.queryParams });
  }

  isAuthRoute(route: string): boolean {
    return route.startsWith(`/${APP_ROUTES.authentication}`);
  }

  resolveLink(
    route: string,
    options: AuthLoginLinkOptions & { analyticsName?: string } = {},
  ): { route: string[]; queryParams?: Record<string, string>; fragment?: string } {
    if (this.isAuthRoute(route)) {
      const authLink = this.buildAuthLoginLink({
        returnUrl: options.returnUrl,
        intent: options.intent,
      });

      return {
        route: authLink.route,
        queryParams: authLink.queryParams,
      };
    }

    const segments = route.split('/').filter(Boolean);
    return { route: ['/', ...segments] };
  }

  trackConversionCta(event: ConversionAnalyticsEvent): void {
    this.analytics.trackConversion(event);
  }
}
