import { Injectable, computed, inject, signal } from '@angular/core';

import { PROJECT_SAVED_VIEWS, PROJECT_TABLE_COLUMNS } from '../config/projects.config';
import { ProjectBulkAction, ProjectListQuery, ProjectSavedView } from '../models/project.model';
import { ProjectStoreService } from './project-store.service';

const STORAGE_KEY = 'mpa-bp-project-list-state';

export type ProjectViewMode = 'card' | 'table';

interface PersistedListState {
  visibleColumns: string[];
  savedViewId: string;
  pageSize: number;
  viewMode: ProjectViewMode;
  favoriteIds: string[];
}

@Injectable({ providedIn: 'root' })
export class ProjectListStateService {
  private readonly store = inject(ProjectStoreService);

  readonly search = signal('');
  readonly statusFilter = signal<ProjectListQuery['statusFilter']>('all');
  readonly stageFilter = signal<ProjectListQuery['stageFilter']>('all');
  readonly healthFilter = signal<ProjectListQuery['healthFilter']>('all');
  readonly cityFilter = signal('');
  readonly includeArchived = signal(false);
  readonly sortValue = signal('name:asc');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly showAdvancedFilters = signal(false);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly savedViewId = signal('all');
  readonly viewMode = signal<ProjectViewMode>('table');
  readonly favoriteIds = signal<readonly string[]>([]);
  readonly visibleColumns = signal<string[]>(
    PROJECT_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id),
  );
  readonly loading = signal(false);
  readonly exportLoading = signal(false);
  readonly importDialogVisible = signal(false);

  readonly savedViews = signal<readonly ProjectSavedView[]>(PROJECT_SAVED_VIEWS);

  readonly query = computed<ProjectListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      statusFilter: this.statusFilter(),
      stageFilter: this.stageFilter(),
      healthFilter: this.healthFilter(),
      cityFilter: this.cityFilter(),
      includeArchived: this.includeArchived(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));

  readonly selectedProjects = computed(() => {
    const ids = new Set(this.selectedIds());
    return this.store.projects().filter((project) => ids.has(project.id));
  });

  readonly hasSelection = computed(() => this.selectedIds().length > 0);

  readonly cities = computed(() => this.store.getCities());

  constructor() {
    this.restore();
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setStatusFilter(value: ProjectListQuery['statusFilter']): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  setStageFilter(value: ProjectListQuery['stageFilter']): void {
    this.stageFilter.set(value);
    this.page.set(1);
  }

  setHealthFilter(value: ProjectListQuery['healthFilter']): void {
    this.healthFilter.set(value);
    this.page.set(1);
  }

  setCityFilter(value: string): void {
    this.cityFilter.set(value);
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

  setViewMode(mode: ProjectViewMode): void {
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
    this.healthFilter.set(view.healthFilter);
    this.page.set(1);
    this.persist();
  }

  toggleFavorite(id: string): void {
    this.favoriteIds.update((ids) =>
      ids.includes(id) ? ids.filter((favId) => favId !== id) : [...ids, id],
    );
    this.persist();
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds().includes(id);
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

  async executeBulkAction(action: ProjectBulkAction): Promise<number> {
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
    this.healthFilter.set('all');
    this.cityFilter.set('');
    this.sortValue.set('name:asc');
    this.page.set(1);
    this.applySavedView('all');
  }

  private persist(): void {
    const state: PersistedListState = {
      visibleColumns: this.visibleColumns(),
      savedViewId: this.savedViewId(),
      pageSize: this.pageSize(),
      viewMode: this.viewMode(),
      favoriteIds: [...this.favoriteIds()],
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
      if (state.viewMode) {
        this.viewMode.set(state.viewMode);
      }
      if (state.favoriteIds) {
        this.favoriteIds.set(state.favoriteIds);
      }
    } catch {
      // ignore corrupt state
    }
  }

  private simulateDelay(ms = 500): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}
