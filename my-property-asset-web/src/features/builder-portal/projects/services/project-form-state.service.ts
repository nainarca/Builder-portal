import { Injectable, signal } from '@angular/core';

import { ProjectFormModel } from '../models/project.model';

const AUTOSAVE_DELAY_MS = 2000;

@Injectable()
export class ProjectFormStateService {
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<ProjectFormModel | null>(null);
  readonly dirty = signal(false);
  readonly saving = signal(false);
  readonly autosaveEnabled = signal(true);
  readonly lastAutosavedAt = signal<string | null>(null);
  readonly errors = signal<Partial<Record<keyof ProjectFormModel, string>>>({});

  initialize(model: ProjectFormModel): void {
    this.model.set({ ...model });
    this.dirty.set(false);
    this.errors.set({});
    this.lastAutosavedAt.set(null);
  }

  patch(partial: Partial<ProjectFormModel>): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.model.set({ ...current, ...partial });
    this.dirty.set(true);
    this.scheduleAutosave();
  }

  setField<K extends keyof ProjectFormModel>(field: K, value: ProjectFormModel[K]): void {
    this.patch({ [field]: value } as Partial<ProjectFormModel>);
  }

  validate(): boolean {
    const model = this.model();
    if (!model) {
      return false;
    }

    const nextErrors: Partial<Record<keyof ProjectFormModel, string>> = {};

    if (!model.name.trim()) {
      nextErrors.name = 'Project name is required';
    }
    if (!model.city.trim()) {
      nextErrors.city = 'City is required';
    }
    if (!model.startDate) {
      nextErrors.startDate = 'Start date is required';
    }
    if (!model.targetCompletionDate) {
      nextErrors.targetCompletionDate = 'Target completion date is required';
    }
    if (
      model.startDate &&
      model.targetCompletionDate &&
      new Date(model.targetCompletionDate) < new Date(model.startDate)
    ) {
      nextErrors.targetCompletionDate = 'Target completion must be after the start date';
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
