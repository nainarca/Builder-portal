import { Injectable } from '@angular/core';

import { Environment } from '../../../environments/environment.model';
import { AppConfiguration, RuntimeConfiguration } from '../models/app-config.model';
import { APPLICATION_CONSTANTS } from '../constants/application.constants';

@Injectable({ providedIn: 'root' })
export class ConfigurationRegistry {
  private entries = new Map<string, AppConfiguration>();

  register(id: string, config: AppConfiguration): void {
    this.entries.set(id, config);
  }

  get(id: string): AppConfiguration | undefined {
    return this.entries.get(id);
  }

  merge(environment: Environment, runtime?: RuntimeConfiguration): AppConfiguration {
    return {
      production: environment.production,
      environmentName: environment.environmentName,
      appTitle: environment.appTitle,
      appVersion: environment.appVersion ?? '0.0.0',
      apiBaseUrl: runtime?.apiBaseUrl ?? '',
      supabase: {
        url: runtime?.supabase?.url ?? environment.supabase.url,
        anonKey: runtime?.supabase?.anonKey ?? environment.supabase.anonKey,
      },
      featureFlagDefaults: {
        ...(environment.featureFlagDefaults ?? {}),
        ...runtime?.featureFlags,
        ...(runtime?.maintenanceMode !== undefined
          ? { 'maintenance-mode': runtime.maintenanceMode }
          : {}),
      },
      runtimeLoaded: Boolean(runtime),
    };
  }

  getDefaultId(): string {
    return APPLICATION_CONSTANTS.appShortName.toLowerCase();
  }
}
