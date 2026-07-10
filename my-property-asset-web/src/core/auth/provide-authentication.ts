import { APP_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';

import { AuthenticationService } from './services/authentication.service';

export function provideAuthentication(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const authentication = inject(AuthenticationService);

        return async () => {
          await authentication.initialize();
        };
      },
    },
  ]);
}
