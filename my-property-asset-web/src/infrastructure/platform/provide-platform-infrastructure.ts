import { APP_INITIALIZER, EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';

import { provideApplicationConfiguration } from '../config';
import { ApplicationConfigurationService } from '../config/services/application-configuration.service';
import { ApplicationEventBusService } from '../events';
import { FeatureFlagService } from '../feature-flags';
import { LanguageService } from '../localization';
import { MaintenanceService } from '../maintenance';
import { UserPreferencesService } from '../preferences';
import { DocumentTitleService, MetaTagService } from '../utilities';
import { provideErrorHandling } from '../error-handling';
import { provideInfrastructure } from '../supabase';
import { Environment } from '../../environments/environment.model';

export function providePlatformInfrastructure(
  config: Environment,
): (Provider | EnvironmentProviders)[] {
  return [
    ...provideInfrastructure(config),
    provideErrorHandling(),
    provideApplicationConfiguration(config.runtimeConfigUrl),
    provideApplicationBootstrap(),
  ];
}

function provideApplicationBootstrap(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (
        configuration: ApplicationConfigurationService,
        featureFlags: FeatureFlagService,
        preferences: UserPreferencesService,
        language: LanguageService,
        maintenance: MaintenanceService,
        eventBus: ApplicationEventBusService,
        documentTitle: DocumentTitleService,
        metaTags: MetaTagService,
      ) => {
        return () => {
          featureFlags.initialize();

          if (featureFlags.isEnabled('maintenance-mode')) {
            maintenance.enable();
          }

          preferences.synchronize();
          language.setLanguage(preferences.preferences().language);
          documentTitle.reset();
          metaTags.setThemeColor('#1a56db');

          eventBus.publish({
            type: 'application.started',
            payload: {
              version: configuration.appVersion(),
              environment: configuration.configuration().environmentName,
            },
            timestamp: Date.now(),
          });

          eventBus.publish({
            type: 'application.config.loaded',
            payload: configuration.configuration(),
            timestamp: Date.now(),
          });
        };
      },
      deps: [
        ApplicationConfigurationService,
        FeatureFlagService,
        UserPreferencesService,
        LanguageService,
        MaintenanceService,
        ApplicationEventBusService,
        DocumentTitleService,
        MetaTagService,
      ],
    },
  ]);
}
