import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { RUNTIME_CONFIG_URL } from '../tokens/injection.tokens';
import { ApplicationConfigurationService } from './services/application-configuration.service';
import { RuntimeConfigurationLoaderService } from './services/runtime-configuration-loader.service';

export function provideApplicationConfiguration(
  runtimeConfigUrl?: string,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: RUNTIME_CONFIG_URL,
      useValue: runtimeConfigUrl,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (loader: RuntimeConfigurationLoaderService, config: ApplicationConfigurationService) => {
        return async () => {
          await loader.load();
          config.refreshFromRegistry();
        };
      },
      deps: [RuntimeConfigurationLoaderService, ApplicationConfigurationService],
    },
  ]);
}
