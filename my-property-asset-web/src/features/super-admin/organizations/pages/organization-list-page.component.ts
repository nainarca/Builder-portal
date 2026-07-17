import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  DialogShellComponent,
  EnterpriseDataTableShellComponent,
  EnterpriseListPageHeaderComponent,
  EnterpriseTableBulkAction,
  EnterpriseTableColumnDef,
  EnterpriseTableSecondaryAction,
  OutlineButtonComponent,
} from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';
import {
  mapActiveFilterChips,
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
    EnterpriseListPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
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

  readonly secondaryActions: readonly EnterpriseTableSecondaryAction[] = [
    { id: 'import', label: 'Import', icon: 'pi pi-upload' },
    { id: 'advanced-filters', label: 'Advanced filters', icon: 'pi pi-filter' },
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

  readonly filterChips = computed(() => {
    const status = this.listState.statusFilter();
    const statusLabel =
      STATUS_QUICK_FILTER_OPTIONS.find((option) => option.id === status)?.label ?? status;
    return mapActiveFilterChips({
      search: this.listState.search(),
      status: {
        id: 'status',
        label: `Status: ${statusLabel}`,
        active: status !== 'all',
      },
      extras: [
        {
          id: 'type',
          label: `Type: ${this.listState.typeFilter()}`,
          active: this.listState.typeFilter() !== 'all',
        },
        {
          id: 'region',
          label: `Region: ${this.listState.regionFilter()}`,
          active: !!this.listState.regionFilter(),
        },
        {
          id: 'plan',
          label: `Plan: ${this.listState.planFilter()}`,
          active: !!this.listState.planFilter(),
        },
      ],
    });
  });

  readonly resultSummary = computed(() => {
    const total = this.listState.listResult().total;
    return `${total} organization${total === 1 ? '' : 's'}`;
  });

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

  onSecondaryAction(actionId: string): void {
    if (actionId === 'import') {
      this.openImport();
      return;
    }
    if (actionId === 'advanced-filters') {
      this.listState.toggleAdvancedFilters();
    }
  }

  onFilterChipRemove(chipId: string): void {
    switch (chipId) {
      case 'search':
        this.listState.setSearch('');
        break;
      case 'status':
        this.listState.setStatusFilter('all');
        break;
      case 'type':
        this.listState.setTypeFilter('all');
        break;
      case 'region':
        this.listState.setRegionFilter('');
        break;
      case 'plan':
        this.listState.setPlanFilter('');
        break;
      default:
        break;
    }
  }

  onClearFilters(): void {
    this.listState.resetFilters();
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
