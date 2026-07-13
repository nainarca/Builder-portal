import { Injectable, computed, inject, signal } from '@angular/core';

import {
  BrandAdminRecord,
  BrandFormModel,
  BrandStudioSection,
  PreviewDevice,
  PreviewSurface,
} from '../models/brand-admin.model';
import { BrandAdminStoreService } from './brand-admin-store.service';

@Injectable({ providedIn: 'root' })
export class BrandStudioStateService {
  private readonly store = inject(BrandAdminStoreService);

  readonly activeBrandId = signal('brand-platform');
  readonly activeSection = signal<BrandStudioSection>('identity');
  readonly previewDevice = signal<PreviewDevice>('desktop');
  readonly previewMode = signal<'light' | 'dark'>('light');
  readonly previewSurface = signal<PreviewSurface>('dashboard');
  readonly draftModel = signal<BrandFormModel | null>(null);
  readonly dirty = signal(false);

  readonly activeBrand = computed(() => this.store.getById(this.activeBrandId()) ?? this.store.getDefault());
  readonly previewBrand = computed<BrandAdminRecord>(() => {
    const base = this.activeBrand();
    const draft = this.draftModel();
    if (!draft) return base;
    return {
      ...base,
      status: draft.status,
      identity: { ...draft.identity },
      colors: { ...draft.colors },
      typography: { ...draft.typography },
      theme: { ...draft.theme },
      preferences: { ...draft.preferences },
    };
  });

  constructor() {
    this.resetDraft();
  }

  selectBrand(id: string): void {
    this.activeBrandId.set(id);
    this.resetDraft();
  }

  setSection(section: BrandStudioSection): void {
    this.activeSection.set(section);
  }

  setPreviewDevice(device: PreviewDevice): void {
    this.previewDevice.set(device);
  }

  setPreviewMode(mode: 'light' | 'dark'): void {
    this.previewMode.set(mode);
  }

  setPreviewSurface(surface: PreviewSurface): void {
    this.previewSurface.set(surface);
  }

  patchDraft(partial: Partial<BrandFormModel>): void {
    const current = this.draftModel();
    if (!current) return;
    this.draftModel.set({ ...current, ...partial });
    this.dirty.set(true);
  }

  patchColors(partial: Partial<BrandFormModel['colors']>): void {
    const current = this.draftModel();
    if (!current) return;
    this.draftModel.set({ ...current, colors: { ...current.colors, ...partial } });
    this.dirty.set(true);
  }

  patchIdentity(partial: Partial<BrandFormModel['identity']>): void {
    const current = this.draftModel();
    if (!current) return;
    this.draftModel.set({ ...current, identity: { ...current.identity, ...partial } });
    this.dirty.set(true);
  }

  save(): BrandAdminRecord | undefined {
    const draft = this.draftModel();
    if (!draft) return undefined;
    const updated = this.store.update(this.activeBrandId(), draft);
    if (updated) {
      this.dirty.set(false);
      this.resetDraft();
    }
    return updated;
  }

  resetDraft(): void {
    const brand = this.activeBrand();
    this.draftModel.set(this.store.toFormModel(brand));
    this.dirty.set(false);
  }

  hasUnsavedChanges(): boolean {
    return this.dirty();
  }
}
