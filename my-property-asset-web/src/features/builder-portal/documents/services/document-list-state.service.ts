import { Injectable, computed, inject, signal } from '@angular/core';

import { DOCUMENT_SAVED_VIEWS, DOCUMENT_TABLE_COLUMNS } from '../config/documents.config';
import {
  DocumentBulkAction,
  DocumentExplorerScope,
  DocumentListQuery,
  DocumentSavedView,
  DocumentViewMode,
} from '../models/document.model';
import { DocumentStoreService } from './document-store.service';

const STORAGE_KEY = 'mpa-bp-document-list-state';

interface PersistedListState {
  visibleColumns: string[];
  savedViewId: string;
  pageSize: number;
  viewMode: DocumentViewMode;
}

@Injectable({ providedIn: 'root' })
export class DocumentListStateService {
  private readonly store = inject(DocumentStoreService);

  readonly search = signal('');
  readonly categoryFilter = signal<DocumentListQuery['categoryFilter']>('all');
  readonly approvalFilter = signal<DocumentListQuery['approvalFilter']>('all');
  readonly visibilityFilter = signal<DocumentListQuery['visibilityFilter']>('all');
  readonly projectFilter = signal('');
  readonly unitFilter = signal('');
  readonly includeArchived = signal(false);
  readonly sortValue = signal('updatedAt:desc');
  readonly page = signal(1);
  readonly pageSize = signal(12);
  readonly showAdvancedFilters = signal(false);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly savedViewId = signal('all');
  readonly viewMode = signal<DocumentViewMode>('grid');
  readonly scope = signal<DocumentExplorerScope>('all');
  readonly visibleColumns = signal<string[]>(
    DOCUMENT_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id),
  );
  readonly loading = signal(false);
  readonly exportLoading = signal(false);

  readonly savedViews = signal<readonly DocumentSavedView[]>(DOCUMENT_SAVED_VIEWS);

  private initialFilterApplied = false;

  readonly query = computed<DocumentListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      categoryFilter: this.categoryFilter(),
      approvalFilter: this.approvalFilter(),
      visibilityFilter: this.visibilityFilter(),
      projectFilter: this.projectFilter(),
      unitFilter: this.unitFilter(),
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

  /** Called once by the workspace page on init to pre-apply a project/unit filter carried via query params. */
  applyInitialFilter(projectId: string | null, unitId: string | null, category: string | null): void {
    if (this.initialFilterApplied) {
      return;
    }
    this.initialFilterApplied = true;
    if (projectId) {
      this.projectFilter.set(projectId);
      this.scope.set('project');
    }
    if (unitId) {
      this.unitFilter.set(unitId);
      this.scope.set('unit');
    }
    if (category) {
      this.categoryFilter.set(category as DocumentListQuery['categoryFilter']);
      this.scope.set('category');
    }
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setCategoryFilter(value: DocumentListQuery['categoryFilter']): void {
    this.categoryFilter.set(value);
    this.page.set(1);
  }

  setApprovalFilter(value: DocumentListQuery['approvalFilter']): void {
    this.approvalFilter.set(value);
    this.page.set(1);
  }

  setVisibilityFilter(value: DocumentListQuery['visibilityFilter']): void {
    this.visibilityFilter.set(value);
    this.page.set(1);
  }

  setProjectFilter(value: string): void {
    this.projectFilter.set(value);
    this.page.set(1);
  }

  setUnitFilter(value: string): void {
    this.unitFilter.set(value);
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

  setViewMode(mode: DocumentViewMode): void {
    this.viewMode.set(mode);
    this.persist();
  }

  setScope(scope: DocumentExplorerScope): void {
    this.scope.set(scope);
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
    this.approvalFilter.set(view.approvalFilter);
    this.categoryFilter.set(view.categoryFilter);
    this.page.set(1);
    this.persist();
  }

  setSelection(ids: readonly string[]): void {
    this.selectedIds.set(ids);
  }

  clearSelection(): void {
    this.selectedIds.set([]);
  }

  async executeBulkAction(action: DocumentBulkAction): Promise<number> {
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
    this.categoryFilter.set('all');
    this.approvalFilter.set('all');
    this.visibilityFilter.set('all');
    this.projectFilter.set('');
    this.unitFilter.set('');
    this.sortValue.set('updatedAt:desc');
    this.page.set(1);
    this.savedViewId.set('all');
    this.scope.set('all');
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
