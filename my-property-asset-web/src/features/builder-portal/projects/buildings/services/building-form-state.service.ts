import { Injectable, signal } from '@angular/core';

import { BuildingFormModel } from '../models/building.model';

@Injectable()
export class BuildingFormStateService {
  readonly model = signal<BuildingFormModel | null>(null);
  readonly dirty = signal(false);
  readonly errors = signal<Partial<Record<keyof BuildingFormModel, string>>>({});

  initialize(model: BuildingFormModel): void {
    this.model.set({ ...model });
    this.dirty.set(false);
    this.errors.set({});
  }

  setField<K extends keyof BuildingFormModel>(field: K, value: BuildingFormModel[K]): void {
    const current = this.model();
    if (!current) {
      return;
    }
    this.model.set({ ...current, [field]: value });
    this.dirty.set(true);
  }

  validate(codeExists?: (code: string) => boolean): boolean {
    const model = this.model();
    if (!model) {
      return false;
    }

    const next: Partial<Record<keyof BuildingFormModel, string>> = {};
    if (!model.name.trim()) {
      next.name = 'Building name is required';
    }
    if (!model.code.trim()) {
      next.code = 'Building code is required';
    } else if (codeExists?.(model.code.trim())) {
      next.code = 'Building code already exists for this project';
    }
    if (model.floorsCount < 0) {
      next.floorsCount = 'Floors cannot be negative';
    }
    if (model.unitsCount < 0) {
      next.unitsCount = 'Units cannot be negative';
    }

    this.errors.set(next);
    return Object.keys(next).length === 0;
  }

  markPristine(): void {
    this.dirty.set(false);
  }

  hasUnsavedChanges(): boolean {
    return this.dirty();
  }
}
