import { Injectable, computed, inject, signal } from '@angular/core';

import { OWNER_SAVED_VIEWS, OWNER_TABLE_COLUMNS } from '../config/owners.config';
import { OwnerBulkAction, OwnerListQuery, OwnerSavedView } from '../models/owner.model';
import { OwnerStoreService } from './owner-store.service';

const STORAGE_KEY = 'mpa-bp-owner-list-state';

export type OwnerViewMode = 'card' | 'table';

interface PersistedListState {
  visibleColumns: string[];
  savedViewId: string;
  pageSize: number;
  viewMode: OwnerViewMode;
}

@Injectable({ providedIn: 'root' })
export class OwnerListStateService {
  private readonly store = inject(OwnerStoreService);

  readonly search = signal('');
  readonly activationFilter = signal<OwnerListQuery['activationFilter']>('all');
  readonly invitationFilter = signal<OwnerListQuery['invitationFilter']>('all');
  readonly projectFilter = signal('');
  readonly includeArchived = signal(false);
  readonly sortValue = signal('updatedAt:desc');
  readonly page = signal(1);
  readonly pageSize = signal(12);
  readonly showAdvancedFilters = signal(false);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly savedViewId = signal('all');
  readonly viewMode = signal<OwnerViewMode>('card');
  readonly visibleColumns = signal<string[]>(
    OWNER_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id),
  );
  readonly loading = signal(false);
  readonly exportLoading = signal(false);

  readonly savedViews = signal<readonly OwnerSavedView[]>(OWNER_SAVED_VIEWS);

  readonly query = computed<OwnerListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      activationFilter: this.activationFilter(),
      invitationFilter: this.invitationFilter(),
      projectFilter: this.projectFilter(),
      includeArchived: this.includeArchived(),
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

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setActivationFilter(value: OwnerListQuery['activationFilter']): void {
    this.activationFilter.set(value);
    this.page.set(1);
  }

  setInvitationFilter(value: OwnerListQuery['invitationFilter']): void {
    this.invitationFilter.set(value);
    this.page.set(1);
  }

  setProjectFilter(value: string): void {
    this.projectFilter.set(value);
    this.page.set(1);
  }

  setIncludeArchived(value: boolean): void {
    this.includeArchived.set(value);
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

  setViewMode(mode: OwnerViewMode): void {
    this.viewMode.set(mode);
    this.persist();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((v) => !v);
  }

  toggleColumn(columnId: string): void {
    this.visibleColumns.update((cols) => {
      const next = cols.includes(columnId) ? cols.filter((id) => id !== columnId) : [...cols, columnId];
      return next.length ? next : cols;
    });
    this.persist();
  }

  isColumnVisible(columnId: string): boolean {
    return this.visibleColumns().includes(columnId);
  }

  applySavedView(viewId: string): void {
    const view = this.savedViews().find((v) => v.id === viewId);
    if (!view) {
      return;
    }
    this.savedViewId.set(viewId);
    this.activationFilter.set(view.activationFilter);
    this.invitationFilter.set(view.invitationFilter);
    this.page.set(1);
    this.persist();
  }

  setSelection(ids: readonly string[]): void {
    this.selectedIds.set(ids);
  }

  clearSelection(): void {
    this.selectedIds.set([]);
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    await this.simulateDelay();
    this.loading.set(false);
  }

  async executeBulkAction(action: OwnerBulkAction): Promise<number> {
    const ids = this.selectedIds();
    if (!ids.length) {
      return 0;
    }

    this.loading.set(true);
    await this.simulateDelay();

    switch (action) {
      case 'archive':
        this.store.bulkArchive(ids);
        break;
      case 'restore':
        this.store.bulkRestore(ids);
        break;
      case 'export':
        this.exportLoading.set(true);
        await this.simulateDelay(400);
        this.exportLoading.set(false);
        break;
    }

    this.loading.set(false);
    this.clearSelection();
    return ids.length;
  }

  async exportAll(): Promise<void> {
    this.exportLoading.set(true);
    await this.simulateDelay(600);
    this.exportLoading.set(false);
  }

  resetFilters(): void {
    this.search.set('');
    this.activationFilter.set('all');
    this.invitationFilter.set('all');
    this.projectFilter.set('');
    this.sortValue.set('updatedAt:desc');
    this.page.set(1);
    this.savedViewId.set('all');
  }

  private persist(): void {
    const state: PersistedListState = {
      visibleColumns: this.visibleColumns(),
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
      if (state.visibleColumns?.length) {
        this.visibleColumns.set(state.visibleColumns);
      }
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

  private simulateDelay(ms = 500): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}
