import { Injectable, signal } from '@angular/core';

import { OwnerFormModel } from '../models/owner.model';

const AUTOSAVE_DELAY_MS = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class OwnerFormStateService {
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<OwnerFormModel | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);
  readonly autosaveEnabled = signal(true);
  readonly lastAutosavedAt = signal<string | null>(null);
  readonly errors = signal<Partial<Record<keyof OwnerFormModel, string>>>({});

  initialize(model: OwnerFormModel): void {
    this.model.set({ ...model });
    this.dirty.set(false);
    this.errors.set({});
    this.lastAutosavedAt.set(null);
  }

  patch(partial: Partial<OwnerFormModel>): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.model.set({ ...current, ...partial });
    this.dirty.set(true);
    this.scheduleAutosave();
  }

  setField<K extends keyof OwnerFormModel>(field: K, value: OwnerFormModel[K]): void {
    this.patch({ [field]: value } as Partial<OwnerFormModel>);
  }

  validate(): boolean {
    const model = this.model();
    if (!model) {
      return false;
    }

    const nextErrors: Partial<Record<keyof OwnerFormModel, string>> = {};

    if (!model.firstName.trim()) {
      nextErrors.firstName = 'First name is required';
    }
    if (!model.lastName.trim()) {
      nextErrors.lastName = 'Last name is required';
    }
    if (!model.email.trim() || !EMAIL_PATTERN.test(model.email.trim())) {
      nextErrors.email = 'A valid email is required';
    }
    if (!model.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
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
