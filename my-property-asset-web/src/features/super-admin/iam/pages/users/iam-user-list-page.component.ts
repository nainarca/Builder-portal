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

import { SuperAdminPageComponent } from '../../../components/layout';
import {
  mapActiveFilterChips,
  mapQuickFilters,
  mapSavedViews,
  mapTableColumns,
  syncVisibleColumns,
  visibleColumnIds,
} from '../../../utils/super-admin-table.helpers';
import { IamSectionNavComponent } from '../../components/shared';
import { IamUserAdvancedFiltersComponent, IamUserDataGridComponent } from '../../components/users/list';
import { USER_SORT_OPTIONS, USER_TABLE_COLUMNS } from '../../config/iam.config';
import { UserAdminRecord, UserBulkAction, UserListQuery } from '../../models/user-admin.model';
import { UserListStateService } from '../../services/user-list-state.service';

const STATUS_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'active' as const, label: 'Active' },
  { id: 'pending' as const, label: 'Pending' },
  { id: 'suspended' as const, label: 'Suspended' },
  { id: 'inactive' as const, label: 'Inactive' },
];

@Component({
  selector: 'app-iam-user-list-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseListPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
    DialogShellComponent,
    AuthorizedButtonComponent,
    IamSectionNavComponent,
    IamUserDataGridComponent,
    IamUserAdvancedFiltersComponent,
  ],
  templateUrl: './iam-user-list-page.component.html',
  styleUrl: './iam-user-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(UserListStateService);

  readonly sortOptions = USER_SORT_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  readonly bulkActions: readonly EnterpriseTableBulkAction[] = [
    { id: 'activate', label: 'Activate', icon: 'pi pi-check' },
    { id: 'deactivate', label: 'Deactivate', icon: 'pi pi-minus' },
    { id: 'suspend', label: 'Suspend', icon: 'pi pi-ban', severity: 'danger' },
    { id: 'archive', label: 'Archive', icon: 'pi pi-archive' },
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
    mapTableColumns(USER_TABLE_COLUMNS, this.listState.visibleColumns()),
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
          id: 'role',
          label: `Role: ${this.listState.roleFilter()}`,
          active: this.listState.roleFilter() !== 'all',
        },
        {
          id: 'organization',
          label: `Organization: ${this.listState.organizationFilter()}`,
          active: !!this.listState.organizationFilter(),
        },
      ],
    });
  });

  readonly resultSummary = computed(() => {
    const total = this.listState.listResult().total;
    return `${total} user${total === 1 ? '' : 's'}`;
  });

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onStatusFilter(filterId: string): void {
    this.listState.setStatusFilter(filterId as UserListQuery['statusFilter']);
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

  onSelectionChange(selection: readonly UserAdminRecord[]): void {
    this.listState.setSelection(selection.map((user) => user.id));
  }

  async onBulkActionId(actionId: string): Promise<void> {
    await this.listState.executeBulkAction(actionId as UserBulkAction);
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
      case 'role':
        this.listState.setRoleFilter('all');
        break;
      case 'organization':
        this.listState.setOrganizationFilter('');
        break;
      default:
        break;
    }
  }

  onClearFilters(): void {
    this.listState.resetFilters();
  }

  createUser(): void {
    void this.router.navigate(['/super-admin/iam/users/new']);
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
