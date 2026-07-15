import { Injectable, signal } from '@angular/core';

import { DocumentFormModel } from '../models/document.model';

const AUTOSAVE_DELAY_MS = 2000;

@Injectable()
export class DocumentFormStateService {
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<DocumentFormModel | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);
  readonly autosaveEnabled = signal(true);
  readonly lastAutosavedAt = signal<string | null>(null);
  readonly errors = signal<Partial<Record<keyof DocumentFormModel, string>>>({});

  initialize(model: DocumentFormModel): void {
    this.model.set({ ...model });
    this.dirty.set(false);
    this.errors.set({});
    this.lastAutosavedAt.set(null);
  }

  patch(partial: Partial<DocumentFormModel>): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.model.set({ ...current, ...partial });
    this.dirty.set(true);
    this.scheduleAutosave();
  }

  setField<K extends keyof DocumentFormModel>(field: K, value: DocumentFormModel[K]): void {
    this.patch({ [field]: value } as Partial<DocumentFormModel>);
  }

  validate(): boolean {
    const model = this.model();
    if (!model) {
      return false;
    }

    const nextErrors: Partial<Record<keyof DocumentFormModel, string>> = {};

    if (!model.name.trim()) {
      nextErrors.name = 'Document name is required';
    }
    if (model.category === 'custom' && !model.customCategoryLabel.trim()) {
      nextErrors.customCategoryLabel = 'Custom category label is required';
    }
    if (!model.projectId) {
      nextErrors.projectId = 'Select a project';
    }
    if (!model.fileName.trim()) {
      nextErrors.fileName = 'A file name placeholder is required';
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
