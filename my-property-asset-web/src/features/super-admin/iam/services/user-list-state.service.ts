import { Injectable, computed, inject, signal } from '@angular/core';

import { USER_SAVED_VIEWS, USER_TABLE_COLUMNS } from '../config/iam.config';
import { UserBulkAction, UserListQuery, UserSavedView } from '../models/user-admin.model';
import { UserAdminStoreService } from './user-admin-store.service';

const STORAGE_KEY = 'mpa-sa-user-list-state';

interface PersistedListState {
  visibleColumns: string[];
  savedViewId: string;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UserListStateService {
  private readonly store = inject(UserAdminStoreService);

  readonly search = signal('');
  readonly statusFilter = signal<UserListQuery['statusFilter']>('all');
  readonly roleFilter = signal<UserListQuery['roleFilter']>('all');
  readonly organizationFilter = signal('');
  readonly sortValue = signal('displayName:asc');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly showAdvancedFilters = signal(false);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly savedViewId = signal('all');
  readonly visibleColumns = signal<string[]>(USER_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id));
  readonly loading = signal(false);
  readonly exportLoading = signal(false);
  readonly importDialogVisible = signal(false);
  readonly savedViews = signal<readonly UserSavedView[]>(USER_SAVED_VIEWS);

  readonly query = computed<UserListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      statusFilter: this.statusFilter(),
      roleFilter: this.roleFilter(),
      organizationFilter: this.organizationFilter(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));
  readonly organizations = computed(() => this.store.getOrganizations());

  constructor() { this.restore(); }

  setSearch(v: string): void { this.search.set(v); this.page.set(1); }
  setStatusFilter(v: UserListQuery['statusFilter']): void { this.statusFilter.set(v); this.page.set(1); }
  setRoleFilter(v: UserListQuery['roleFilter']): void { this.roleFilter.set(v); this.page.set(1); }
  setOrganizationFilter(v: string): void { this.organizationFilter.set(v); this.page.set(1); }
  setSort(v: string): void { this.sortValue.set(v); }
  toggleAdvancedFilters(): void { this.showAdvancedFilters.update((x) => !x); }
  setSelection(ids: readonly string[]): void { this.selectedIds.set(ids); }
  clearSelection(): void { this.selectedIds.set([]); }

  toggleColumn(columnId: string): void {
    this.visibleColumns.update((cols) => {
      const next = cols.includes(columnId) ? cols.filter((id) => id !== columnId) : [...cols, columnId];
      return next.length ? next : cols;
    });
    this.persist();
  }

  applySavedView(viewId: string): void {
    const view = this.savedViews().find((v) => v.id === viewId);
    if (!view) return;
    this.savedViewId.set(viewId);
    this.statusFilter.set(view.statusFilter);
    this.roleFilter.set(view.roleFilter);
    this.page.set(1);
    this.persist();
  }

  async executeBulkAction(action: UserBulkAction): Promise<number> {
    const ids = this.selectedIds();
    if (!ids.length) return 0;
    this.loading.set(true);
    await this.delay();
    let count = 0;
    if (action === 'activate') count = this.store.bulkSetStatus(ids, 'active');
    else if (action === 'deactivate') count = this.store.bulkSetStatus(ids, 'inactive');
    else if (action === 'suspend') count = this.store.bulkSetStatus(ids, 'suspended');
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
    this.roleFilter.set('all');
    this.organizationFilter.set('');
    this.sortValue.set('displayName:asc');
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
