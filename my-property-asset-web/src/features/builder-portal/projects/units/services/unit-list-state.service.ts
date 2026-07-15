import { Injectable, computed, inject, signal } from '@angular/core';

import { UNIT_SAVED_VIEWS, UNIT_TABLE_COLUMNS } from '../config/units.config';
import { UnitBulkAction, UnitListQuery, UnitSavedView } from '../models/unit.model';
import { UnitStoreService } from './unit-store.service';

const STORAGE_KEY = 'mpa-bp-unit-list-state';

export type UnitViewMode = 'card' | 'table';

interface PersistedListState {
  visibleColumns: string[];
  savedViewId: string;
  pageSize: number;
  viewMode: UnitViewMode;
}

@Injectable({ providedIn: 'root' })
export class UnitListStateService {
  private readonly store = inject(UnitStoreService);

  readonly projectId = signal('');
  readonly search = signal('');
  readonly statusFilter = signal<UnitListQuery['statusFilter']>('all');
  readonly stageFilter = signal<UnitListQuery['stageFilter']>('all');
  readonly typeFilter = signal<UnitListQuery['typeFilter']>('all');
  readonly towerFilter = signal('');
  readonly floorFilter = signal<UnitListQuery['floorFilter']>('all');
  readonly includeArchived = signal(false);
  readonly sortValue = signal('unitNumber:asc');
  readonly page = signal(1);
  readonly pageSize = signal(12);
  readonly showAdvancedFilters = signal(false);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly savedViewId = signal('all');
  readonly viewMode = signal<UnitViewMode>('card');
  readonly visibleColumns = signal<string[]>(
    UNIT_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id),
  );
  readonly loading = signal(false);
  readonly exportLoading = signal(false);
  readonly importDialogVisible = signal(false);

  readonly savedViews = signal<readonly UnitSavedView[]>(UNIT_SAVED_VIEWS);

  readonly query = computed<UnitListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      projectId: this.projectId(),
      search: this.search(),
      statusFilter: this.statusFilter(),
      stageFilter: this.stageFilter(),
      typeFilter: this.typeFilter(),
      towerFilter: this.towerFilter(),
      floorFilter: this.floorFilter(),
      includeArchived: this.includeArchived(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));

  readonly selectedUnits = computed(() => {
    const ids = new Set(this.selectedIds());
    return this.store.units().filter((unit) => ids.has(unit.id));
  });

  readonly hasSelection = computed(() => this.selectedIds().length > 0);

  readonly towers = computed(() => this.store.getTowers(this.projectId()));
  readonly floors = computed(() => this.store.getFloors(this.projectId(), this.towerFilter() || undefined));

  constructor() {
    this.restore();
  }

  setProjectId(projectId: string): void {
    if (this.projectId() === projectId) {
      return;
    }
    this.projectId.set(projectId);
    this.resetFilters();
    this.clearSelection();
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setStatusFilter(value: UnitListQuery['statusFilter']): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  setStageFilter(value: UnitListQuery['stageFilter']): void {
    this.stageFilter.set(value);
    this.page.set(1);
  }

  setTypeFilter(value: UnitListQuery['typeFilter']): void {
    this.typeFilter.set(value);
    this.page.set(1);
  }

  setTowerFilter(value: string): void {
    this.towerFilter.set(value);
    this.floorFilter.set('all');
    this.page.set(1);
  }

  setFloorFilter(value: UnitListQuery['floorFilter']): void {
    this.floorFilter.set(value);
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

  setViewMode(mode: UnitViewMode): void {
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
    this.statusFilter.set(view.statusFilter);
    this.stageFilter.set(view.stageFilter);
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

  async executeBulkAction(action: UnitBulkAction): Promise<number> {
    const ids = this.selectedIds();
    if (!ids.length) {
      return 0;
    }

    this.loading.set(true);
    await this.simulateDelay();

    let count = 0;
    switch (action) {
      case 'archive':
        count = this.store.bulkArchive(ids);
        break;
      case 'restore':
        count = this.store.bulkRestore(ids);
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
    this.stageFilter.set('all');
    this.typeFilter.set('all');
    this.towerFilter.set('');
    this.floorFilter.set('all');
    this.sortValue.set('unitNumber:asc');
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
