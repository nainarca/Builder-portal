import { Injectable, computed, signal } from '@angular/core';

import { MOCK_BRAND_CHANGES, MOCK_BRANDS } from '../config/branding.config';
import {
  BrandAdminRecord,
  BrandAdminStatus,
  BrandChangeRecord,
  BrandFormModel,
} from '../models/brand-admin.model';

@Injectable({ providedIn: 'root' })
export class BrandAdminStoreService {
  private readonly brandsSignal = signal<BrandAdminRecord[]>([...MOCK_BRANDS]);

  readonly brands = this.brandsSignal.asReadonly();
  readonly activeCount = computed(() => this.brandsSignal().filter((b) => b.status === 'active').length);
  readonly draftCount = computed(() => this.brandsSignal().filter((b) => b.status === 'draft').length);

  getById(id: string): BrandAdminRecord | undefined {
    return this.brandsSignal().find((b) => b.id === id);
  }

  getDefault(): BrandAdminRecord {
    return this.brandsSignal()[0];
  }

  getRecentChanges(limit = 5): readonly BrandChangeRecord[] {
    return [...MOCK_BRAND_CHANGES].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
  }

  update(id: string, model: BrandFormModel): BrandAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;

    const updated: BrandAdminRecord = {
      ...existing,
      status: model.status,
      identity: { ...model.identity },
      colors: { ...model.colors },
      typography: { ...model.typography },
      theme: { ...model.theme },
      preferences: { ...model.preferences },
      healthScore: this.computeHealthScore(model),
      updatedAt: new Date().toISOString(),
    };

    this.brandsSignal.update((list) => list.map((b) => (b.id === id ? updated : b)));
    return updated;
  }

  setStatus(id: string, status: BrandAdminStatus): BrandAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    const updated = { ...existing, status, updatedAt: new Date().toISOString() };
    this.brandsSignal.update((list) => list.map((b) => (b.id === id ? updated : b)));
    return updated;
  }

  toFormModel(brand: BrandAdminRecord): BrandFormModel {
    return {
      identity: { ...brand.identity },
      colors: { ...brand.colors },
      typography: { ...brand.typography },
      theme: { ...brand.theme },
      preferences: { ...brand.preferences },
      status: brand.status,
    };
  }

  private computeHealthScore(model: BrandFormModel): number {
    let score = 100;
    if (!model.identity.applicationName.trim()) score -= 20;
    if (!model.colors.primary) score -= 15;
    if (!model.typography.fontFamily.trim()) score -= 10;
    return Math.max(0, Math.min(100, score));
  }
}
