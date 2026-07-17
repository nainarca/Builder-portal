import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

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

import { BuilderPortalPageComponent } from '../../../components/layout';
import {
  mapQuickFilters,
  mapSavedViews,
  mapTableColumns,
  syncVisibleColumns,
  visibleColumnIds } from '../../../utils/builder-portal-table.helpers';
import { DashboardKpiItem } from '../../../models/dashboard.model';
import { UNIT_SORT_OPTIONS, UNIT_TABLE_COLUMNS } from '../config/units.config';
import {
  UnitAdvancedFiltersComponent,
  UnitCardGridComponent,
  UnitDataGridComponent } from '../components/list';
import { TowerFloorSelectorComponent, TowerOverviewComponent, UnitGridVisualizationComponent, UnitQuickStatsComponent } from '../components/workspace';
import { Unit, UnitBulkAction, UnitStatus } from '../models/unit.model';
import { UnitListStateService } from '../services/unit-list-state.service';
import { UnitStoreService } from '../services/unit-store.service';
import { ProjectStoreService } from '../../services/project-store.service';

const STATUS_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'available' as const, label: 'Available' },
  { id: 'reserved' as const, label: 'Reserved' },
  { id: 'sold' as const, label: 'Sold' },
  { id: 'blocked' as const, label: 'Blocked' },
];

@Component({
  selector: 'app-unit-workspace-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseFormPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
    GhostButtonComponent,
    DialogShellComponent,
    RouterLink,
    PaginationWrapperComponent,
    UnitQuickStatsComponent,
    TowerFloorSelectorComponent,
    TowerOverviewComponent,
    UnitGridVisualizationComponent,
    UnitDataGridComponent,
    UnitCardGridComponent,
    UnitAdvancedFiltersComponent,
  ],
  templateUrl: './unit-workspace-page.component.html',
  styleUrl: './unit-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class UnitWorkspacePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(UnitStoreService);
  private readonly projectStore = inject(ProjectStoreService);
  readonly listState = inject(UnitListStateService);

  readonly sortOptions = UNIT_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly bulkActions: readonly EnterpriseTableBulkAction[] = [
    { id: 'archive', label: 'Archive', icon: 'pi pi-archive', severity: 'danger' },
    { id: 'restore', label: 'Restore', icon: 'pi pi-replay' },
    { id: 'export', label: 'Export', icon: 'pi pi-download' },
  ];

  readonly projectId = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly project = computed(() => this.projectStore.getById(this.projectId()));

  readonly allProjectUnits = computed(() =>
    this.store.units().filter((unit) => unit.projectId === this.projectId() && !unit.archived),
  );

  readonly towers = computed(() => this.store.getTowers(this.projectId()));

  readonly visualizationUnits = computed(() => {
    const towerFilter = this.listState.towerFilter();
    const floorFilter = this.listState.floorFilter();
    return this.allProjectUnits().filter(
      (unit) =>
        (!towerFilter || unit.towerId === towerFilter) &&
        (floorFilter === 'all' || unit.floorNumber === floorFilter),
    );
  });

  readonly quickStats = computed<readonly DashboardKpiItem[]>(() => {
    const units = this.allProjectUnits();
    const pending = units.filter((u) => u.constructionStage !== 'handed-over' && u.constructionStage !== 'ready-for-handover').length;
    const readyForHandover = units.filter((u) => u.constructionStage === 'ready-for-handover').length;
    const reserved = units.filter((u) => u.status === 'reserved').length;
    const completed = units.filter((u) => u.constructionStage === 'handed-over').length;
    return [
      { id: 'pending', label: 'Pending units', value: String(pending), icon: 'pi pi-hourglass', tone: 'warning' },
      { id: 'ready', label: 'Ready for handover', value: String(readyForHandover), icon: 'pi pi-key', tone: 'info' },
      { id: 'reserved', label: 'Reserved units', value: String(reserved), icon: 'pi pi-clock', tone: 'primary' },
      { id: 'completed', label: 'Completed units', value: String(completed), icon: 'pi pi-check-circle', tone: 'success' },
    ];
  });

  readonly statusQuickFilters = computed(() =>
    mapQuickFilters(STATUS_QUICK_FILTER_OPTIONS, this.listState.statusFilter()),
  );

  readonly savedSearchOptions = computed(() =>
    mapSavedViews(this.listState.savedViews(), this.listState.savedViewId()),
  );

  readonly tableColumns = computed(() =>
    mapTableColumns(UNIT_TABLE_COLUMNS, this.listState.visibleColumns()),
  );

  constructor() {
    this.listState.setProjectId(this.projectId());
  }

  goToProject(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId()]);
  }

  createUnit(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units', 'create']);
  }

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onStatusFilter(filterId: string): void {
    this.listState.setStatusFilter(filterId as UnitStatus | 'all');
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

  onSelectionChange(selection: readonly Unit[]): void {
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
    await this.listState.executeBulkAction(actionId as UnitBulkAction);
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
