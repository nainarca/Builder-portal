import { APP_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';

import { AUTH_EVENT_TYPES } from '@core/auth/constants/auth.constants';
import { ApplicationEventBusService } from '@infrastructure/events';
import { OrganizationContextManagerService } from './services/organization-context-manager.service';

export function provideOrganizationContext(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const manager = inject(OrganizationContextManagerService);
        const eventBus = inject(ApplicationEventBusService);

        return async () => {
          manager.initialize();

          eventBus.on(AUTH_EVENT_TYPES.signedIn, () => {
            void manager.resolve();
          });

          eventBus.on(AUTH_EVENT_TYPES.signedOut, () => {
            manager.clear();
          });
        };
      },
    },
  ]);
}
