import { Injectable, computed, inject, signal } from '@angular/core';

import { BUILDER_SAVED_VIEWS, BUILDER_TABLE_COLUMNS } from '../config/builders.config';
import {
  BuilderBulkAction,
  BuilderListQuery,
  BuilderSavedView,
} from '../models/builder-admin.model';
import { BuilderAdminStoreService } from './builder-admin-store.service';

const STORAGE_KEY = 'mpa-sa-builder-list-state';

interface PersistedListState {
  visibleColumns: string[];
  savedViewId: string;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class BuilderListStateService {
  private readonly store = inject(BuilderAdminStoreService);

  readonly search = signal('');
  readonly statusFilter = signal<BuilderListQuery['statusFilter']>('all');
  readonly regionFilter = signal('');
  readonly planFilter = signal('');
  readonly sortValue = signal('companyName:asc');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly showAdvancedFilters = signal(false);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly savedViewId = signal('all');
  readonly visibleColumns = signal<string[]>(
    BUILDER_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id),
  );
  readonly loading = signal(false);
  readonly exportLoading = signal(false);
  readonly importDialogVisible = signal(false);
  readonly savedViews = signal<readonly BuilderSavedView[]>(BUILDER_SAVED_VIEWS);

  readonly query = computed<BuilderListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      statusFilter: this.statusFilter(),
      regionFilter: this.regionFilter(),
      planFilter: this.planFilter(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));
  readonly hasSelection = computed(() => this.selectedIds().length > 0);
  readonly regions = computed(() => this.store.getRegions());
  readonly plans = computed(() => this.store.getPlans());

  constructor() {
    this.restore();
  }

  setSearch(value: string): void { this.search.set(value); this.page.set(1); }
  setStatusFilter(value: BuilderListQuery['statusFilter']): void { this.statusFilter.set(value); this.page.set(1); }
  setRegionFilter(value: string): void { this.regionFilter.set(value); this.page.set(1); }
  setPlanFilter(value: string): void { this.planFilter.set(value); this.page.set(1); }
  setSort(value: string): void { this.sortValue.set(value); }
  setPageSize(size: number): void { this.pageSize.set(size); this.page.set(1); this.persist(); }
  toggleAdvancedFilters(): void { this.showAdvancedFilters.update((v) => !v); }

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
    if (!view) return;
    this.savedViewId.set(viewId);
    this.statusFilter.set(view.statusFilter);
    this.regionFilter.set(view.regionFilter);
    this.page.set(1);
    this.persist();
  }

  setSelection(ids: readonly string[]): void { this.selectedIds.set(ids); }
  clearSelection(): void { this.selectedIds.set([]); }

  async refresh(): Promise<void> {
    this.loading.set(true);
    await this.delay();
    this.loading.set(false);
  }

  async executeBulkAction(action: BuilderBulkAction): Promise<number> {
    const ids = this.selectedIds();
    if (!ids.length) return 0;
    this.loading.set(true);
    await this.delay();
    let count = 0;
    if (action === 'activate') count = this.store.bulkSetStatus(ids, 'active');
    else if (action === 'deactivate') count = this.store.bulkSetStatus(ids, 'inactive');
    else if (action === 'archive') count = this.store.bulkSetStatus(ids, 'archived');
    else if (action === 'export') { this.exportLoading.set(true); await this.delay(400); this.exportLoading.set(false); count = ids.length; }
    this.loading.set(false);
    this.clearSelection();
    return count;
  }

  async exportAll(): Promise<void> { this.exportLoading.set(true); await this.delay(600); this.exportLoading.set(false); }
  openImportDialog(): void { this.importDialogVisible.set(true); }
  closeImportDialog(): void { this.importDialogVisible.set(false); }

  resetFilters(): void {
    this.search.set('');
    this.statusFilter.set('all');
    this.regionFilter.set('');
    this.planFilter.set('');
    this.sortValue.set('companyName:asc');
    this.page.set(1);
    this.applySavedView('all');
  }

  private persist(): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      visibleColumns: this.visibleColumns(),
      savedViewId: this.savedViewId(),
      pageSize: this.pageSize(),
    }));
  }

  private restore(): void {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw) as PersistedListState;
      if (state.visibleColumns?.length) this.visibleColumns.set(state.visibleColumns);
      if (state.savedViewId) this.applySavedView(state.savedViewId);
      if (state.pageSize) this.pageSize.set(state.pageSize);
    } catch { /* ignore */ }
  }

  private delay(ms = 500): Promise<void> {
    return new Promise((r) => window.setTimeout(r, ms));
  }
}
