import { Injectable, computed, inject, signal } from '@angular/core';

import { HANDOVER_SAVED_VIEWS } from '../config/handovers.config';
import { HandoverListQuery, HandoverSavedView, HandoverViewMode } from '../models/handover.model';
import { HandoverStoreService } from './handover-store.service';

const STORAGE_KEY = 'mpa-bp-handover-list-state';

interface PersistedListState {
  savedViewId: string;
  pageSize: number;
  viewMode: HandoverViewMode;
}

@Injectable({ providedIn: 'root' })
export class HandoverListStateService {
  private readonly store = inject(HandoverStoreService);

  readonly search = signal('');
  readonly statusFilter = signal<HandoverListQuery['statusFilter']>('all');
  readonly projectFilter = signal('');
  readonly unitFilter = signal('');
  readonly sortValue = signal('updatedAt:desc');
  readonly page = signal(1);
  readonly pageSize = signal(12);
  readonly showAdvancedFilters = signal(false);
  readonly savedViewId = signal('all');
  readonly viewMode = signal<HandoverViewMode>('card');

  readonly savedViews = signal<readonly HandoverSavedView[]>(HANDOVER_SAVED_VIEWS);

  private initialFilterApplied = false;

  readonly query = computed<HandoverListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      statusFilter: this.statusFilter(),
      projectFilter: this.projectFilter(),
      unitFilter: this.unitFilter(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));

  constructor() {
    this.restore();
  }

  /** Called once by the workspace page on init to pre-apply a project/unit filter carried via query params. */
  applyInitialFilter(projectId: string | null, unitId: string | null): void {
    if (this.initialFilterApplied) {
      return;
    }
    this.initialFilterApplied = true;
    if (projectId) {
      this.projectFilter.set(projectId);
    }
    if (unitId) {
      this.unitFilter.set(unitId);
    }
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setStatusFilter(value: HandoverListQuery['statusFilter']): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  setProjectFilter(value: string): void {
    this.projectFilter.set(value);
    this.page.set(1);
  }

  setSort(value: string): void {
    this.sortValue.set(value);
  }

  setPage(page: number): void {
    this.page.set(page);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.persist();
  }

  setViewMode(mode: HandoverViewMode): void {
    this.viewMode.set(mode);
    this.persist();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((v) => !v);
  }

  applySavedView(viewId: string): void {
    const view = this.savedViews().find((v) => v.id === viewId);
    if (!view) {
      return;
    }
    this.savedViewId.set(viewId);
    this.statusFilter.set(view.statusFilter);
    this.page.set(1);
    this.persist();
  }

  resetFilters(): void {
    this.search.set('');
    this.statusFilter.set('all');
    this.projectFilter.set('');
    this.unitFilter.set('');
    this.sortValue.set('updatedAt:desc');
    this.page.set(1);
    this.savedViewId.set('all');
  }

  private persist(): void {
    const state: PersistedListState = {
      savedViewId: this.savedViewId(),
      pageSize: this.pageSize(),
      viewMode: this.viewMode(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private restore(): void {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      const state = JSON.parse(raw) as PersistedListState;
      if (state.savedViewId) {
        this.savedViewId.set(state.savedViewId);
      }
      if (state.pageSize) {
        this.pageSize.set(state.pageSize);
      }
      if (state.viewMode) {
        this.viewMode.set(state.viewMode);
      }
    } catch {
      // ignore corrupt state
    }
  }
}
