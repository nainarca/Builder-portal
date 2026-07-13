import { Injectable, signal } from '@angular/core';

import { BuilderFormModel } from '../models/builder-admin.model';

const AUTOSAVE_DELAY_MS = 2000;

@Injectable()
export class BuilderFormStateService {
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<BuilderFormModel | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);
  readonly autosaveEnabled = signal(true);
  readonly lastAutosavedAt = signal<string | null>(null);
  readonly errors = signal<Partial<Record<keyof BuilderFormModel, string>>>({});

  initialize(model: BuilderFormModel): void {
    this.model.set({ ...model });
    this.dirty.set(false);
    this.errors.set({});
    this.lastAutosavedAt.set(null);
  }

  patch(partial: Partial<BuilderFormModel>): void {
    const current = this.model();
    if (!current) return;
    this.model.set({ ...current, ...partial });
    this.dirty.set(true);
    this.scheduleAutosave();
  }

  setField<K extends keyof BuilderFormModel>(field: K, value: BuilderFormModel[K]): void {
    this.patch({ [field]: value } as Partial<BuilderFormModel>);
  }

  validate(): boolean {
    const model = this.model();
    if (!model) return false;
    const errors: Partial<Record<keyof BuilderFormModel, string>> = {};
    if (!model.companyName.trim()) errors.companyName = 'Company name is required';
    if (!model.primaryContactName.trim()) errors.primaryContactName = 'Primary contact is required';
    if (!model.primaryContactEmail.trim()) errors.primaryContactEmail = 'Contact email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.primaryContactEmail)) {
      errors.primaryContactEmail = 'Enter a valid email address';
    }
    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  markPristine(): void { this.dirty.set(false); this.clearAutosave(); }
  hasUnsavedChanges(): boolean { return this.dirty(); }
  destroy(): void { this.clearAutosave(); }

  private scheduleAutosave(): void {
    if (!this.autosaveEnabled()) return;
    this.clearAutosave();
    this.autosaveTimer = setTimeout(() => void this.performAutosave(), AUTOSAVE_DELAY_MS);
  }

  private async performAutosave(): Promise<void> {
    if (!this.dirty() || !this.validate()) return;
    this.saving.set(true);
    await new Promise((r) => window.setTimeout(r, 400));
    this.lastAutosavedAt.set(new Date().toISOString());
    this.saving.set(false);
  }

  private clearAutosave(): void {
    if (this.autosaveTimer) { clearTimeout(this.autosaveTimer); this.autosaveTimer = null; }
  }
}
