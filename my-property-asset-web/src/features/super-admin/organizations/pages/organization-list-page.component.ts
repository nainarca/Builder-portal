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
import {
  OrganizationAdvancedFiltersComponent,
  OrganizationDataGridComponent,
} from '../components/list';
import { ORGANIZATION_SORT_OPTIONS, ORGANIZATION_TABLE_COLUMNS } from '../config/organizations.config';
import {
  OrganizationAdminRecord,
  OrganizationAdminStatus,
  OrganizationBulkAction,
} from '../models/organization-admin.model';
import { OrganizationListStateService } from '../services/organization-list-state.service';

const STATUS_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'active' as const, label: 'Active' },
  { id: 'pending' as const, label: 'Pending' },
  { id: 'inactive' as const, label: 'Inactive' },
  { id: 'archived' as const, label: 'Archived' },
];

@Component({
  selector: 'app-organization-list-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
    GhostButtonComponent,
    DialogShellComponent,
    AuthorizedButtonComponent,
    OrganizationDataGridComponent,
    OrganizationAdvancedFiltersComponent,
  ],
  templateUrl: './organization-list-page.component.html',
  styleUrl: './organization-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(OrganizationListStateService);

  readonly sortOptions = ORGANIZATION_SORT_OPTIONS.map((option) => ({
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
    mapTableColumns(ORGANIZATION_TABLE_COLUMNS, this.listState.visibleColumns()),
  );

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onStatusFilter(filterId: string): void {
    this.listState.setStatusFilter(filterId as OrganizationAdminStatus | 'all');
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

  onSelectionChange(selection: readonly OrganizationAdminRecord[]): void {
    this.listState.setSelection(selection.map((item) => item.id));
  }

  async onBulkActionId(actionId: string): Promise<void> {
    await this.listState.executeBulkAction(actionId as OrganizationBulkAction);
  }

  createOrganization(): void {
    void this.router.navigate(['/super-admin/organizations/new']);
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
