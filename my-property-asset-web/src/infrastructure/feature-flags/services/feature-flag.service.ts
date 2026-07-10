import { Injectable, computed, inject, signal } from '@angular/core';

import { ApplicationConfigurationService } from '../../config';
import { ApplicationEventBusService } from '../../events/services/application-event-bus.service';
import { STORAGE_KEYS, StorageService } from '../../storage';
import { FeatureFlagRegistry } from '../registry/feature-flag.registry';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly registry = inject(FeatureFlagRegistry);
  private readonly configuration = inject(ApplicationConfigurationService);
  private readonly storage = inject(StorageService);
  private readonly eventBus = inject(ApplicationEventBusService);

  private readonly overrides = signal<Record<string, boolean>>(
    this.storage.get<Record<string, boolean>>(STORAGE_KEYS.featureFlagOverrides) ?? {},
  );

  readonly flags = computed(() => {
    const defaults = this.configuration.featureFlagDefaults();
    const overrides = this.overrides();
    const resolved: Record<string, boolean> = { ...defaults };

    for (const [key, value] of Object.entries(overrides)) {
      resolved[key] = value;
    }

    return resolved;
  });

  private initialized = false;

  constructor() {
    // Registry is populated during initialize() after configuration bootstrap.
  }

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.bootstrapRegistry();
    this.initialized = true;
  }

  isEnabled(key: string): boolean {
    const definition = this.registry.get(key);
    const resolved = this.flags();
    return resolved[key] ?? definition?.defaultEnabled ?? false;
  }

  setOverride(key: string, enabled: boolean): void {
    this.overrides.update((current) => {
      const next = { ...current, [key]: enabled };
      this.storage.set(STORAGE_KEYS.featureFlagOverrides, next);
      return next;
    });

    this.eventBus.publish({
      type: 'feature-flag.changed',
      payload: { key, enabled },
      timestamp: Date.now(),
    });
  }

  clearOverride(key: string): void {
    this.overrides.update((current) => {
      const next = { ...current };
      delete next[key];
      this.storage.set(STORAGE_KEYS.featureFlagOverrides, next);
      return next;
    });
  }

  async loadRemoteFlags(): Promise<void> {
    // Framework hook for future remote feature flag providers.
  }

  private bootstrapRegistry(): void {
    const defaults = this.configuration.featureFlagDefaults();

    this.registry.registerMany(
      Object.entries(defaults).map(([key, defaultEnabled]) => ({
        key,
        description: key,
        defaultEnabled,
        remoteCapable: true,
      })),
    );
  }
}
