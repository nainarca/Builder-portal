import { Injectable, signal } from '@angular/core';

import { AppConfiguration } from '../models/app-config.model';
import { APPLICATION_CONSTANTS } from '../constants/application.constants';

@Injectable({ providedIn: 'root' })
export class ConfigurationCacheService {
  private readonly cache = signal<{
    config: AppConfiguration | null;
    loadedAt: number | null;
  }>({
    config: null,
    loadedAt: null,
  });

  get(): AppConfiguration | null {
    const entry = this.cache();
    if (!entry.config || !entry.loadedAt) {
      return null;
    }

    if (Date.now() - entry.loadedAt > APPLICATION_CONSTANTS.configCacheTtlMs) {
      return null;
    }

    return entry.config;
  }

  set(config: AppConfiguration): void {
    this.cache.set({ config, loadedAt: Date.now() });
  }

  clear(): void {
    this.cache.set({ config: null, loadedAt: null });
  }
}
