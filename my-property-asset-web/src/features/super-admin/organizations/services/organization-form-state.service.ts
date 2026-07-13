import { Injectable, signal } from '@angular/core';

import { OrganizationFormModel } from '../models/organization-admin.model';

const AUTOSAVE_DELAY_MS = 2000;

@Injectable()
export class OrganizationFormStateService {
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<OrganizationFormModel | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);
  readonly autosaveEnabled = signal(true);
  readonly lastAutosavedAt = signal<string | null>(null);
  readonly errors = signal<Partial<Record<keyof OrganizationFormModel, string>>>({});

  initialize(model: OrganizationFormModel): void {
    this.model.set({ ...model });
    this.dirty.set(false);
    this.errors.set({});
    this.lastAutosavedAt.set(null);
  }

  patch(partial: Partial<OrganizationFormModel>): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.model.set({ ...current, ...partial });
    this.dirty.set(true);
    this.scheduleAutosave();
  }

  setField<K extends keyof OrganizationFormModel>(field: K, value: OrganizationFormModel[K]): void {
    this.patch({ [field]: value } as Partial<OrganizationFormModel>);
  }

  validate(): boolean {
    const model = this.model();
    if (!model) {
      return false;
    }

    const nextErrors: Partial<Record<keyof OrganizationFormModel, string>> = {};

    if (!model.name.trim()) {
      nextErrors.name = 'Organization name is required';
    }
    if (model.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.contactEmail)) {
      nextErrors.contactEmail = 'Enter a valid email address';
    }
    if (model.slug && !/^[a-z0-9-]+$/.test(model.slug)) {
      nextErrors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens';
    }

    this.errors.set(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  markPristine(): void {
    this.dirty.set(false);
    this.clearAutosave();
  }

  hasUnsavedChanges(): boolean {
    return this.dirty();
  }

  destroy(): void {
    this.clearAutosave();
  }

  private scheduleAutosave(): void {
    if (!this.autosaveEnabled()) {
      return;
    }
    this.clearAutosave();
    this.autosaveTimer = setTimeout(() => {
      void this.performAutosave();
    }, AUTOSAVE_DELAY_MS);
  }

  private async performAutosave(): Promise<void> {
    if (!this.dirty() || !this.validate()) {
      return;
    }
    this.saving.set(true);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    this.lastAutosavedAt.set(new Date().toISOString());
    this.saving.set(false);
  }

  private clearAutosave(): void {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }
}
