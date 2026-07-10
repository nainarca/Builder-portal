import { Injectable, computed, inject, signal } from '@angular/core';

import { ENVIRONMENT } from '../../tokens/injection.tokens';
import { AppConfiguration } from '../models/app-config.model';
import { ConfigurationRegistry } from '../registry/configuration.registry';
import { RuntimeConfigurationLoaderService } from './runtime-configuration-loader.service';

@Injectable({ providedIn: 'root' })
export class ApplicationConfigurationService {
  private readonly environment = inject(ENVIRONMENT);
  private readonly registry = inject(ConfigurationRegistry);
  private readonly runtimeLoader = inject(RuntimeConfigurationLoaderService);

  private readonly configSignal = signal<AppConfiguration>(
    this.registry.merge(this.environment),
  );

  readonly configuration = this.configSignal.asReadonly();
  readonly isRuntimeLoaded = computed(() => this.configSignal().runtimeLoaded);
  readonly featureFlagDefaults = computed(() => this.configSignal().featureFlagDefaults);
  readonly appTitle = computed(() => this.configSignal().appTitle);
  readonly appVersion = computed(() => this.configSignal().appVersion);
  readonly apiBaseUrl = computed(() => this.configSignal().apiBaseUrl);

  refreshFromRegistry(): void {
    const registered = this.registry.get(this.registry.getDefaultId());
    if (registered) {
      this.configSignal.set(registered);
    }
  }

  async reload(): Promise<void> {
    await this.runtimeLoader.load();
    this.refreshFromRegistry();
  }

  resolve<T>(selector: (config: AppConfiguration) => T): T {
    return selector(this.configSignal());
  }
}
