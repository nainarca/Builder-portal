import { Injectable, computed, inject, signal } from '@angular/core';

import { SettingsCategoryId, SettingsFormSnapshot } from '../models/settings-admin.model';
import { SettingsAdminStoreService } from './settings-admin-store.service';

@Injectable({ providedIn: 'root' })
export class SettingsSectionStateService {
  private readonly store = inject(SettingsAdminStoreService);

  readonly activeCategory = signal<SettingsCategoryId>('general');
  readonly draft = signal<SettingsFormSnapshot | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);

  readonly record = computed(() => this.store.record());

  constructor() {
    this.resetDraft();
  }

  setCategory(category: SettingsCategoryId): void {
    this.activeCategory.set(category);
  }

  resetDraft(): void {
    this.draft.set(this.store.getSnapshot());
    this.dirty.set(false);
  }

  patchDraft<K extends keyof SettingsFormSnapshot>(section: K, value: SettingsFormSnapshot[K]): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({ ...current, [section]: value });
    this.dirty.set(true);
  }

  save(): void {
    const snapshot = this.draft();
    if (!snapshot) return;
    this.saving.set(true);
    this.store.saveSnapshot(snapshot);
    this.dirty.set(false);
    this.saving.set(false);
  }
}
