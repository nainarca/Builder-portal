import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  DialogShellComponent,
  EnterpriseDataTableShellComponent,
  EnterpriseFormPageHeaderComponent,
  EnterpriseTableBulkAction,
  EnterpriseTableColumnDef,
  EnterpriseTableViewMode,
  GhostButtonComponent,
  OutlineButtonComponent,
  PaginationWrapperComponent,
} from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import {
  mapQuickFilters,
  mapSavedViews,
  mapTableColumns,
  syncVisibleColumns,
  visibleColumnIds } from '../../utils/builder-portal-table.helpers';
import {
  ProjectAdvancedFiltersComponent,
  ProjectCardGridComponent,
  ProjectDataGridComponent } from '../components/list';
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

@Component({
  selector: 'app-project-list-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseFormPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
    GhostButtonComponent,
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

  readonly sortOptions = PROJECT_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly bulkActions: readonly EnterpriseTableBulkAction[] = [
    { id: 'archive', label: 'Archive', icon: 'pi pi-archive', severity: 'danger' },
    { id: 'restore', label: 'Restore', icon: 'pi pi-replay' },
    { id: 'export', label: 'Export', icon: 'pi pi-download' },
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
