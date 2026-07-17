import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  EnterpriseDataTableShellComponent,
  EnterpriseListPageHeaderComponent,
  EnterpriseTableBulkAction,
  EnterpriseTableColumnDef,
  EnterpriseTableSecondaryAction,
  PrimaryButtonComponent,
} from '@shared/ui';

import { KpiCardComponent } from '../../components/cards';
import { ChartWrapperComponent } from '../../components/charts';
import { BuilderPortalPageComponent } from '../../components/layout';
import { DashboardChartConfig, DashboardKpiItem } from '../../models/dashboard.model';
import {
  mapActiveFilterChips,
  mapQuickFilters,
  mapSavedViews,
  mapTableColumns,
  syncVisibleColumns,
  visibleColumnIds,
} from '../../utils/builder-portal-table.helpers';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import { OwnerAdvancedFiltersComponent, OwnerDataGridComponent } from '../components/list';
import {
  AssignmentSummaryRow,
  AssignmentSummaryWidgetComponent,
  RecentAssignmentsWidgetComponent,
} from '../components/workspace';
import { OWNER_TABLE_COLUMNS, OWNER_WORKSPACE_HEADER, OWNER_SORT_OPTIONS } from '../config/owners.config';
import { OwnerActivationStatus, OwnerBulkAction, OwnerListItem } from '../models/owner.model';
import { OwnerListStateService } from '../services/owner-list-state.service';
import { OwnerStoreService } from '../services/owner-store.service';

const ACTIVATION_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'not-invited' as const, label: 'Not invited' },
  { id: 'invited' as const, label: 'Invited' },
  { id: 'activated' as const, label: 'Activated' },
];

@Component({
  selector: 'app-owner-workspace-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseListPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    PrimaryButtonComponent,
    KpiCardComponent,
    ChartWrapperComponent,
    AssignmentSummaryWidgetComponent,
    RecentAssignmentsWidgetComponent,
    OwnerDataGridComponent,
    OwnerAdvancedFiltersComponent,
  ],
  templateUrl: './owner-workspace-page.component.html',
  styleUrl: './owner-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerWorkspacePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(OwnerStoreService);
  private readonly projectStore = inject(ProjectStoreService);
  readonly listState = inject(OwnerListStateService);

  readonly header = OWNER_WORKSPACE_HEADER;
  readonly sortOptions = OWNER_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly bulkActions: readonly EnterpriseTableBulkAction[] = [
    { id: 'archive', label: 'Archive', icon: 'pi pi-archive', severity: 'danger' },
    { id: 'restore', label: 'Restore', icon: 'pi pi-replay' },
    { id: 'export', label: 'Export', icon: 'pi pi-download' },
  ];

  readonly secondaryActions: readonly EnterpriseTableSecondaryAction[] = [
    { id: 'advanced-filters', label: 'Advanced filters', icon: 'pi pi-filter' },
  ];

  readonly projects = computed(() => this.projectStore.projects());

  private readonly activeOwners = computed(() => this.store.owners().filter((o) => !o.archived));
  private readonly activeAssignments = computed(() => this.store.assignments());

  readonly kpis = computed<readonly DashboardKpiItem[]>(() => {
    const owners = this.activeOwners();
    const assignments = this.activeAssignments();
    const pending = assignments.filter((a) => a.status === 'active' && a.invitation.status === 'pending').length;
    const activated = owners.filter((o) => o.activationStatus === 'activated').length;
    const activeCount = assignments.filter((a) => a.status === 'active').length;
    return [
      { id: 'total-owners', label: 'Total owners', value: String(owners.length), icon: 'pi pi-users', tone: 'primary' },
      { id: 'pending-invitations', label: 'Pending invitations', value: String(pending), icon: 'pi pi-send', tone: 'warning' },
      { id: 'activated-owners', label: 'Activated owners', value: String(activated), icon: 'pi pi-check-circle', tone: 'success' },
      { id: 'active-assignments', label: 'Active assignments', value: String(activeCount), icon: 'pi pi-building', tone: 'info' },
    ];
  });

  readonly assignmentStatusSummary = computed<readonly AssignmentSummaryRow[]>(() => {
    const assignments = this.activeAssignments();
    return [
      { label: 'Active', value: assignments.filter((a) => a.status === 'active').length, color: 'var(--mpa-color-success)' },
      { label: 'Reassigned', value: assignments.filter((a) => a.status === 'reassigned').length, color: 'var(--mpa-color-info)' },
      { label: 'Removed', value: assignments.filter((a) => a.status === 'removed').length, color: 'var(--mpa-color-text-muted)' },
    ];
  });

  readonly invitationStatusChart = computed<DashboardChartConfig>(() => {
    const assignments = this.activeAssignments().filter((a) => a.status === 'active');
    const labels = ['Pending', 'Accepted', 'Expired', 'Cancelled'];
    const counts = [
      assignments.filter((a) => a.invitation.status === 'pending').length,
      assignments.filter((a) => a.invitation.status === 'accepted').length,
      assignments.filter((a) => a.invitation.status === 'expired').length,
      assignments.filter((a) => a.invitation.status === 'cancelled').length,
    ];
    return {
      id: 'invitation-status',
      type: 'donut',
      title: 'Invitation status',
      subtitle: 'Active assignments by invitation state',
      labels,
      series: [{ label: 'Invitations', values: counts }],
    };
  });

  readonly recentAssignments = computed(() =>
    [...this.activeAssignments()]
      .filter((a) => a.status === 'active')
      .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt))
      .slice(0, 4),
  );

  readonly activationQuickFilters = computed(() =>
    mapQuickFilters(ACTIVATION_QUICK_FILTER_OPTIONS, this.listState.activationFilter()),
  );

  readonly savedSearchOptions = computed(() =>
    mapSavedViews(this.listState.savedViews(), this.listState.savedViewId()),
  );

  readonly tableColumns = computed(() =>
    mapTableColumns(OWNER_TABLE_COLUMNS, this.listState.visibleColumns()),
  );

  readonly ownerFilterChips = computed(() => {
    const activation = this.listState.activationFilter();
    const activationLabel =
      ACTIVATION_QUICK_FILTER_OPTIONS.find((option) => option.id === activation)?.label ?? activation;
    const invitation = this.listState.invitationFilter();
    const projectId = this.listState.projectFilter();
    const projectName = this.projects().find((p) => p.id === projectId)?.name ?? projectId;
    return mapActiveFilterChips({
      search: this.listState.search(),
      status: {
        id: 'activation',
        label: `Activation: ${activationLabel}`,
        active: activation !== 'all',
      },
      extras: [
        {
          id: 'invitation',
          label: `Invitation: ${invitation}`,
          active: invitation !== 'all',
        },
        {
          id: 'project',
          label: `Project: ${projectName}`,
          active: !!projectId,
        },
        {
          id: 'archived',
          label: 'Include archived',
          active: this.listState.includeArchived(),
        },
      ],
    });
  });

  readonly ownerResultSummary = computed(() => {
    const total = this.listState.listResult().total;
    return `${total} owner${total === 1 ? '' : 's'}`;
  });

  goToAssign(): void {
    void this.router.navigate(['/builder-portal/owners/assign']);
  }

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onActivationFilter(filterId: string): void {
    this.listState.setActivationFilter(filterId as OwnerActivationStatus | 'all');
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

  onSelectionChange(selection: readonly OwnerListItem[]): void {
    this.listState.setSelection(selection.map((item) => item.owner.id));
  }

  onOwnerSecondaryAction(actionId: string): void {
    if (actionId === 'advanced-filters') {
      this.listState.toggleAdvancedFilters();
    }
  }

  onOwnerFilterChipRemove(chipId: string): void {
    switch (chipId) {
      case 'search':
        this.listState.setSearch('');
        break;
      case 'activation':
        this.listState.setActivationFilter('all');
        break;
      case 'invitation':
        this.listState.setInvitationFilter('all');
        break;
      case 'project':
        this.listState.setProjectFilter('');
        break;
      case 'archived':
        this.listState.setIncludeArchived(false);
        break;
      default:
        break;
    }
  }

  async onBulkActionId(actionId: string): Promise<void> {
    await this.listState.executeBulkAction(actionId as OwnerBulkAction);
  }

  async exportAll(): Promise<void> {
    await this.listState.exportAll();
  }
}
