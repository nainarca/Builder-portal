import { Injectable, computed, inject, signal } from '@angular/core';

import { ORGANIZATION_SAVED_VIEWS, ORGANIZATION_TABLE_COLUMNS } from '../config/organizations.config';
import {
  OrganizationBulkAction,
  OrganizationListQuery,
  OrganizationSavedView,
} from '../models/organization-admin.model';
import { OrganizationAdminStoreService } from './organization-admin-store.service';

const STORAGE_KEY = 'mpa-sa-org-list-state';

interface PersistedListState {
  visibleColumns: string[];
  savedViewId: string;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class OrganizationListStateService {
  private readonly store = inject(OrganizationAdminStoreService);

  readonly search = signal('');
  readonly statusFilter = signal<OrganizationListQuery['statusFilter']>('all');
  readonly typeFilter = signal<OrganizationListQuery['typeFilter']>('all');
  readonly regionFilter = signal('');
  readonly planFilter = signal('');
  readonly sortValue = signal('name:asc');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly showAdvancedFilters = signal(false);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly savedViewId = signal('all');
  readonly visibleColumns = signal<string[]>(
    ORGANIZATION_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id),
  );
  readonly loading = signal(false);
  readonly exportLoading = signal(false);
  readonly importDialogVisible = signal(false);

  readonly savedViews = signal<readonly OrganizationSavedView[]>(ORGANIZATION_SAVED_VIEWS);

  readonly query = computed<OrganizationListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      statusFilter: this.statusFilter(),
      typeFilter: this.typeFilter(),
      regionFilter: this.regionFilter(),
      planFilter: this.planFilter(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));

  readonly selectedOrganizations = computed(() => {
    const ids = new Set(this.selectedIds());
    return this.store.organizations().filter((org) => ids.has(org.id));
  });

  readonly hasSelection = computed(() => this.selectedIds().length > 0);

  readonly regions = computed(() => this.store.getRegions());
  readonly plans = computed(() => this.store.getPlans());

  constructor() {
    this.restore();
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setStatusFilter(value: OrganizationListQuery['statusFilter']): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  setTypeFilter(value: OrganizationListQuery['typeFilter']): void {
    this.typeFilter.set(value);
    this.page.set(1);
  }

  setRegionFilter(value: string): void {
    this.regionFilter.set(value);
    this.page.set(1);
  }

  setPlanFilter(value: string): void {
    this.planFilter.set(value);
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

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((v) => !v);
  }

  toggleColumn(columnId: string): void {
    this.visibleColumns.update((cols) => {
      const next = cols.includes(columnId)
        ? cols.filter((id) => id !== columnId)
        : [...cols, columnId];
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
    this.statusFilter.set(view.statusFilter);
    this.typeFilter.set(view.typeFilter);
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

  async executeBulkAction(action: OrganizationBulkAction): Promise<number> {
    const ids = this.selectedIds();
    if (!ids.length) {
      return 0;
    }

    this.loading.set(true);
    await this.simulateDelay();

    let count = 0;
    switch (action) {
      case 'activate':
        count = this.store.bulkSetStatus(ids, 'active');
        break;
      case 'deactivate':
        count = this.store.bulkSetStatus(ids, 'inactive');
        break;
      case 'archive':
        count = this.store.bulkSetStatus(ids, 'archived');
        break;
      case 'export':
        this.exportLoading.set(true);
        await this.simulateDelay(400);
        this.exportLoading.set(false);
        count = ids.length;
        break;
    }

    this.loading.set(false);
    this.clearSelection();
    return count;
  }

  async exportAll(): Promise<void> {
    this.exportLoading.set(true);
    await this.simulateDelay(600);
    this.exportLoading.set(false);
  }

  openImportDialog(): void {
    this.importDialogVisible.set(true);
  }

  closeImportDialog(): void {
    this.importDialogVisible.set(false);
  }

  resetFilters(): void {
    this.search.set('');
    this.statusFilter.set('all');
    this.typeFilter.set('all');
    this.regionFilter.set('');
    this.planFilter.set('');
    this.sortValue.set('name:asc');
    this.page.set(1);
    this.applySavedView('all');
  }

  private persist(): void {
    const state: PersistedListState = {
      visibleColumns: this.visibleColumns(),
      savedViewId: this.savedViewId(),
      pageSize: this.pageSize(),
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
        this.applySavedView(state.savedViewId);
      }
      if (state.pageSize) {
        this.pageSize.set(state.pageSize);
      }
    } catch {
      // ignore corrupt state
    }
  }

  private simulateDelay(ms = 500): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}
