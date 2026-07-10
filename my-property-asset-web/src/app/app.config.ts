import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { providePlatformInfrastructure } from '../infrastructure';
import { httpErrorInterceptor } from '../infrastructure/error-handling';
import { provideNavigation } from '../navigation';
import { provideSharedUi } from '../shared/ui';
import { MyPropertyAssetPreset, provideThemeEngine } from '../theme';
import { provideAuthentication } from '@core/auth';
import { provideAuthorization } from '@core/rbac';
import { provideOrganizationContext } from '@core/organization-context';
import { providePublicWebsite } from '@features/public-website/provide-public-website';
import { provideSeo } from '@infrastructure/seo';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    providePrimeNG({
      theme: {
        preset: MyPropertyAssetPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '[data-theme-resolved="dark"]',
          cssLayer: false,
        },
      },
      ripple: true,
    }),
    ...providePlatformInfrastructure(environment),
    provideAuthentication(),
    provideOrganizationContext(),
    provideAuthorization(),
    provideNavigation(),
    provideSeo(),
    providePublicWebsite(),
    provideThemeEngine(),
    provideSharedUi(),
  ],
};
