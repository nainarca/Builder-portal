import { Injectable, inject } from '@angular/core';

import { ENVIRONMENT, RUNTIME_CONFIG_URL } from '../../tokens/injection.tokens';
import { RuntimeConfiguration } from '../models/app-config.model';
import { APPLICATION_CONSTANTS } from '../constants/application.constants';
import { ConfigurationCacheService } from './configuration-cache.service';
import { ConfigurationRegistry } from '../registry/configuration.registry';
import { ConfigurationValidatorService } from './configuration-validator.service';
import { LoggerService } from '../../logging/services/logger.service';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigurationLoaderService {
  private readonly environment = inject(ENVIRONMENT);
  private readonly runtimeConfigUrl = inject(RUNTIME_CONFIG_URL, { optional: true });
  private readonly registry = inject(ConfigurationRegistry);
  private readonly cache = inject(ConfigurationCacheService);
  private readonly validator = inject(ConfigurationValidatorService);
  private readonly logger = inject(LoggerService);

  private runtimeConfig: RuntimeConfiguration | undefined;

  async load(): Promise<void> {
    const cached = this.cache.get();
    if (cached) {
      this.registry.register(this.registry.getDefaultId(), cached);
      return;
    }

    const runtime = await this.fetchRuntimeConfig();
    this.runtimeConfig = runtime;

    const merged = this.registry.merge(this.environment, runtime);
    const validation = this.validator.validate(merged);

    if (!validation.valid) {
      this.logger.warn('Application configuration validation issues detected', {
        issues: validation.issues,
      });
    }

    this.registry.register(this.registry.getDefaultId(), merged);
    this.cache.set(merged);
  }

  getRuntimeConfig(): RuntimeConfiguration | undefined {
    return this.runtimeConfig;
  }

  private async fetchRuntimeConfig(): Promise<RuntimeConfiguration | undefined> {
    const url = this.runtimeConfigUrl ?? APPLICATION_CONSTANTS.runtimeConfigAssetPath;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        return undefined;
      }

      return (await response.json()) as RuntimeConfiguration;
    } catch {
      this.logger.info('Runtime configuration not loaded; using build-time environment defaults.');
      return undefined;
    }
  }
}
