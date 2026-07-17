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
  EnterpriseTableViewMode,
  OutlineButtonComponent,
  PaginationWrapperComponent,
} from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import {
  mapActiveFilterChips,
  mapQuickFilters,
  mapSavedViews,
  mapTableColumns,
  syncVisibleColumns,
  visibleColumnIds,
} from '../../utils/builder-portal-table.helpers';
import {
  ProjectAdvancedFiltersComponent,
  ProjectCardGridComponent,
  ProjectDataGridComponent,
} from '../components/list';
import { PROJECT_SORT_OPTIONS, PROJECT_TABLE_COLUMNS } from '../config/projects.config';
import { Project, ProjectBulkAction, ProjectStatus } from '../models/project.model';
import { ProjectListStateService } from '../services/project-list-state.service';

const STATUS_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'upcoming' as const, label: 'Upcoming' },
  { id: 'planning' as const, label: 'Planning' },
  { id: 'construction' as const, label: 'Construction' },
  { id: 'completed' as const, label: 'Completed' },
];

/** Portfolio entity — table/card toggle allowed (UI-REBIRTH §6). */
const VIEW_MODE_POLICY = 'portfolio' as const;

@Component({
  selector: 'app-project-list-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseListPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
    DialogShellComponent,
    AuthorizedButtonComponent,
    PaginationWrapperComponent,
    ProjectDataGridComponent,
    ProjectCardGridComponent,
    ProjectAdvancedFiltersComponent,
  ],
  templateUrl: './project-list-page.component.html',
  styleUrl: './project-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(ProjectListStateService);

  /** @see VIEW_MODE_POLICY — portfolio entities keep card/table toggle. */
  readonly viewModePolicy = VIEW_MODE_POLICY;

  readonly sortOptions = PROJECT_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly bulkActions: readonly EnterpriseTableBulkAction[] = [
    { id: 'archive', label: 'Archive', icon: 'pi pi-archive', severity: 'danger' },
    { id: 'restore', label: 'Restore', icon: 'pi pi-replay' },
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
    mapTableColumns(PROJECT_TABLE_COLUMNS, this.listState.visibleColumns()),
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
          id: 'city',
          label: `City: ${this.listState.cityFilter()}`,
          active: !!this.listState.cityFilter(),
        },
        {
          id: 'archived',
          label: 'Including archived',
          active: this.listState.includeArchived(),
        },
      ],
    });
  });

  readonly resultSummary = computed(() => {
    const total = this.listState.listResult().total;
    return `${total} project${total === 1 ? '' : 's'}`;
  });

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onStatusFilter(filterId: string): void {
    this.listState.setStatusFilter(filterId as ProjectStatus | 'all');
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

  onSelectionChange(selection: readonly Project[]): void {
    this.listState.setSelection(selection.map((item) => item.id));
  }

  onViewModeChange(mode: EnterpriseTableViewMode): void {
    this.listState.setViewMode(mode);
  }

  onCardPageChange(event: unknown): void {
    const paginatorEvent = event as { first?: number; rows?: number };
    const rows = paginatorEvent.rows ?? this.listState.pageSize();
    const first = paginatorEvent.first ?? 0;
    if (rows !== this.listState.pageSize()) {
      this.listState.setPageSize(rows);
      return;
    }
    this.listState.setPage(Math.floor(first / rows) + 1);
  }

  async onBulkActionId(actionId: string): Promise<void> {
    await this.listState.executeBulkAction(actionId as ProjectBulkAction);
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
      case 'city':
        this.listState.setCityFilter('');
        break;
      case 'archived':
        this.listState.setIncludeArchived(false);
        break;
      default:
        break;
    }
  }

  onClearFilters(): void {
    this.listState.resetFilters();
  }

  createProject(): void {
    void this.router.navigate(['/builder-portal/projects/create']);
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
