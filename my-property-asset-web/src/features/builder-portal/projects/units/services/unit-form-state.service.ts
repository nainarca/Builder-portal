import { Injectable, signal } from '@angular/core';

import { UnitFormModel } from '../models/unit.model';

const AUTOSAVE_DELAY_MS = 2000;

@Injectable()
export class UnitFormStateService {
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<UnitFormModel | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);
  readonly autosaveEnabled = signal(true);
  readonly lastAutosavedAt = signal<string | null>(null);
  readonly errors = signal<Partial<Record<keyof UnitFormModel, string>>>({});

  initialize(model: UnitFormModel): void {
    this.model.set({ ...model });
    this.dirty.set(false);
    this.errors.set({});
    this.lastAutosavedAt.set(null);
  }

  patch(partial: Partial<UnitFormModel>): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.model.set({ ...current, ...partial });
    this.dirty.set(true);
    this.scheduleAutosave();
  }

  setField<K extends keyof UnitFormModel>(field: K, value: UnitFormModel[K]): void {
    this.patch({ [field]: value } as Partial<UnitFormModel>);
  }

  validate(): boolean {
    const model = this.model();
    if (!model) {
      return false;
    }

    const nextErrors: Partial<Record<keyof UnitFormModel, string>> = {};

    if (!model.unitNumber.trim()) {
      nextErrors.unitNumber = 'Unit number is required';
    }
    if (!model.towerId) {
      nextErrors.towerId = 'Tower is required';
    }
    if (!model.floorNumber || model.floorNumber < 1) {
      nextErrors.floorNumber = 'Floor number must be at least 1';
    }
    if (!model.configuration.trim()) {
      nextErrors.configuration = 'Configuration is required';
    }
    if (!model.areaSqft || model.areaSqft <= 0) {
      nextErrors.areaSqft = 'Area must be greater than 0';
    }
    if (model.progress < 0 || model.progress > 100) {
      nextErrors.progress = 'Progress must be between 0 and 100';
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
