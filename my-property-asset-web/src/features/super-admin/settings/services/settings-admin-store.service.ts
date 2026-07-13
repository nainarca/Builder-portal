import { Injectable, computed, signal } from '@angular/core';

import { MOCK_PLATFORM_SETTINGS } from '../config/settings.config';
import {
  PlatformSettingsRecord,
  SettingsCategoryId,
  SettingsFormSnapshot,
} from '../models/settings-admin.model';

@Injectable({ providedIn: 'root' })
export class SettingsAdminStoreService {
  private readonly recordSignal = signal<PlatformSettingsRecord>(structuredClone(MOCK_PLATFORM_SETTINGS));

  readonly record = this.recordSignal.asReadonly();
  readonly healthScore = computed(() => {
    const r = this.recordSignal();
    let score = 100;
    if (r.platform.maintenanceMode) score -= 5;
    if (!r.security.authenticationPolicy.mfaRequired) score -= 10;
    if (r.platform.configurationStatus === 'warning') score -= 8;
    if (r.platform.configurationStatus === 'error') score -= 20;
    return Math.max(0, score);
  });

  getSnapshot(): SettingsFormSnapshot {
    const r = this.recordSignal();
    return {
      general: structuredClone(r.general),
      security: structuredClone(r.security),
      platform: structuredClone(r.platform),
      notifications: structuredClone(r.notifications),
      localization: structuredClone(r.localization),
      integrations: structuredClone(r.integrations),
      preferences: structuredClone(r.preferences),
    };
  }

  saveSnapshot(snapshot: SettingsFormSnapshot): void {
    this.recordSignal.update((current) => ({
      ...current,
      ...snapshot,
      updatedAt: new Date().toISOString(),
    }));
  }

  updateCategory<K extends SettingsCategoryId>(
    category: K,
    value: SettingsFormSnapshot[K extends keyof SettingsFormSnapshot ? K : never],
  ): void {
    this.recordSignal.update((current) => ({
      ...current,
      [category]: value,
      updatedAt: new Date().toISOString(),
    }));
  }
}
