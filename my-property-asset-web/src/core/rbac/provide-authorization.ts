import { APP_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';

import { AuthorizationService } from './services/authorization.service';

export function provideAuthorization(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const authorization = inject(AuthorizationService);
        return async () => {
          authorization.initialize();
          await authorization.resolveAuthorization();
        };
      },
    },
  ]);
}
