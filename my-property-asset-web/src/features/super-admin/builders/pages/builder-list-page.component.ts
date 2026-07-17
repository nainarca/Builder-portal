import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  DialogShellComponent,
  EnterpriseDataTableShellComponent,
  EnterpriseFormPageHeaderComponent,
  EnterpriseTableBulkAction,
  EnterpriseTableColumnDef,
  GhostButtonComponent,
  OutlineButtonComponent,
} from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';
import {
  mapQuickFilters,
  mapSavedViews,
  mapTableColumns,
  syncVisibleColumns,
  visibleColumnIds,
} from '../../utils/super-admin-table.helpers';
import { BuilderAdvancedFiltersComponent, BuilderDataGridComponent } from '../components/list';
import { BUILDER_SORT_OPTIONS, BUILDER_TABLE_COLUMNS } from '../config/builders.config';
import { BuilderAdminRecord, BuilderAdminStatus, BuilderBulkAction } from '../models/builder-admin.model';
import { BuilderListStateService } from '../services/builder-list-state.service';

const STATUS_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'active' as const, label: 'Active' },
  { id: 'pending' as const, label: 'Pending' },
  { id: 'inactive' as const, label: 'Inactive' },
  { id: 'archived' as const, label: 'Archived' },
];

@Component({
  selector: 'app-builder-list-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
    GhostButtonComponent,
    DialogShellComponent,
    AuthorizedButtonComponent,
    BuilderDataGridComponent,
    BuilderAdvancedFiltersComponent,
  ],
  templateUrl: './builder-list-page.component.html',
  styleUrl: './builder-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(BuilderListStateService);

  readonly sortOptions = BUILDER_SORT_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  readonly bulkActions: readonly EnterpriseTableBulkAction[] = [
    { id: 'activate', label: 'Activate', icon: 'pi pi-check' },
    { id: 'deactivate', label: 'Deactivate', icon: 'pi pi-pause' },
    { id: 'archive', label: 'Archive', icon: 'pi pi-archive', severity: 'danger' },
    { id: 'export', label: 'Export', icon: 'pi pi-download' },
  ];

  readonly statusQuickFilters = computed(() =>
    mapQuickFilters(STATUS_QUICK_FILTER_OPTIONS, this.listState.statusFilter()),
  );

  readonly savedSearchOptions = computed(() =>
    mapSavedViews(this.listState.savedViews(), this.listState.savedViewId()),
  );

  readonly tableColumns = computed(() =>
    mapTableColumns(BUILDER_TABLE_COLUMNS, this.listState.visibleColumns()),
  );

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onStatusFilter(filterId: string): void {
    this.listState.setStatusFilter(filterId as BuilderAdminStatus | 'all');
  }

  onSavedView(viewId: string): void {
    this.listState.applySavedView(viewId);
  }

  onColumnsChange(columns: readonly EnterpriseTableColumnDef[]): void {
    syncVisibleColumns(
      this.listState.visibleColumns(),
      visibleColumnIds(columns),
      (columnId) => this.listState.toggleColumn(columnId),
    );
  }

  onSelectionChange(selection: readonly BuilderAdminRecord[]): void {
    this.listState.setSelection(selection.map((item) => item.id));
  }

  async onBulkActionId(actionId: string): Promise<void> {
    await this.listState.executeBulkAction(actionId as BuilderBulkAction);
  }

  createBuilder(): void {
    void this.router.navigate(['/super-admin/builders/new']);
  }

  async exportAll(): Promise<void> {
    await this.listState.exportAll();
  }

  openImport(): void {
    this.listState.openImportDialog();
  }

  onImportDialogVisible(visible: boolean): void {
    if (!visible) {
      this.listState.closeImportDialog();
    }
  }
}
