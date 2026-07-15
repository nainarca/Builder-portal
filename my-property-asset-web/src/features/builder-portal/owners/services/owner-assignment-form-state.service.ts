import { Injectable, signal } from '@angular/core';

import { OwnerAssignmentFormModel } from '../models/owner.model';

const AUTOSAVE_DELAY_MS = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErrorKey = keyof OwnerAssignmentFormModel | 'newOwner.firstName' | 'newOwner.lastName' | 'newOwner.email' | 'newOwner.phone';

@Injectable()
export class OwnerAssignmentFormStateService {
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<OwnerAssignmentFormModel | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);
  readonly autosaveEnabled = signal(true);
  readonly lastAutosavedAt = signal<string | null>(null);
  readonly errors = signal<Partial<Record<ErrorKey, string>>>({});

  initialize(model: OwnerAssignmentFormModel): void {
    this.model.set({ ...model, newOwner: { ...model.newOwner } });
    this.dirty.set(false);
    this.errors.set({});
    this.lastAutosavedAt.set(null);
  }

  patch(partial: Partial<OwnerAssignmentFormModel>): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.model.set({ ...current, ...partial });
    this.dirty.set(true);
    this.scheduleAutosave();
  }

  setField<K extends keyof OwnerAssignmentFormModel>(field: K, value: OwnerAssignmentFormModel[K]): void {
    this.patch({ [field]: value } as Partial<OwnerAssignmentFormModel>);
  }

  setNewOwnerField<K extends keyof OwnerAssignmentFormModel['newOwner']>(
    field: K,
    value: OwnerAssignmentFormModel['newOwner'][K],
  ): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.patch({ newOwner: { ...current.newOwner, [field]: value } });
  }

  validate(): boolean {
    const model = this.model();
    if (!model) {
      return false;
    }

    const nextErrors: Partial<Record<ErrorKey, string>> = {};

    if (model.ownerMode === 'existing' && !model.existingOwnerId) {
      nextErrors.existingOwnerId = 'Select an existing owner';
    }
    if (model.ownerMode === 'new') {
      if (!model.newOwner.firstName.trim()) {
        nextErrors['newOwner.firstName'] = 'First name is required';
      }
      if (!model.newOwner.lastName.trim()) {
        nextErrors['newOwner.lastName'] = 'Last name is required';
      }
      if (!model.newOwner.email.trim() || !EMAIL_PATTERN.test(model.newOwner.email.trim())) {
        nextErrors['newOwner.email'] = 'A valid email is required';
      }
      if (!model.newOwner.phone.trim()) {
        nextErrors['newOwner.phone'] = 'Phone number is required';
      }
    }
    if (!model.projectId) {
      nextErrors.projectId = 'Select a project';
    }
    if (!model.unitId) {
      nextErrors.unitId = 'Select a unit';
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
      this.saving.set(true);
      window.setTimeout(() => {
        this.lastAutosavedAt.set(new Date().toISOString());
        this.saving.set(false);
      }, 400);
    }, AUTOSAVE_DELAY_MS);
  }

  private clearAutosave(): void {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }
}
