import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { HasPermissionDirective } from '@core/rbac';
import {
  EmptyNoDataComponent,
  EnterpriseDataTableShellComponent,
  EnterpriseListPageHeaderComponent,
  OutlineButtonComponent,
  PrimaryButtonComponent,
} from '@shared/ui';

import { BuilderPortalPageComponent } from '../../../components/layout';
import { mapActiveFilterChips, mapQuickFilters } from '../../../utils/builder-portal-table.helpers';
import { ProjectStoreService } from '../../services/project-store.service';
import {
  BUILDING_SORT_OPTIONS,
  BUILDING_STATUS_LABELS,
  BUILDING_STATUS_OPTIONS,
} from '../config/buildings.config';
import { BuildingCardComponent } from '../components/shared/building-card.component';
import { BuildingStatusBadgeComponent } from '../components/shared/building-status-badge.component';
import { BuildingStatus } from '../models/building.model';
import { BuildingListStateService } from '../services/building-list-state.service';
import { BuildingService } from '../services/building.service';
import { buildingsAreRequired, resolveBuildingMode } from '../utils/project-building-compatibility';

const STATUS_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'planning' as const, label: 'Planning' },
  { id: 'construction' as const, label: 'Construction' },
  { id: 'completed' as const, label: 'Completed' },
  { id: 'archived' as const, label: 'Archived' },
];

@Component({
  selector: 'app-building-list-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseListPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    OutlineButtonComponent,
    PrimaryButtonComponent,
    RouterLink,
    HasPermissionDirective,
    EmptyNoDataComponent,
    BuildingCardComponent,
    BuildingStatusBadgeComponent,
    DatePipe,
  ],
  templateUrl: './building-list-page.component.html',
  styleUrl: './building-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingListPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projects = inject(ProjectStoreService);
  private readonly buildingService = inject(BuildingService);
  readonly listState = inject(BuildingListStateService);

  private readonly projectId = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly project = computed(() => this.projects.getById(this.projectId()));
  readonly stats = computed(() => this.buildingService.dashboardStats(this.projectId()));
  readonly buildingMode = computed(() => {
    const project = this.project();
    return project ? resolveBuildingMode(project) : 'optional';
  });
  readonly buildingsRequired = computed(() => {
    const project = this.project();
    return project ? buildingsAreRequired(project) : false;
  });

  readonly statusOptions = BUILDING_STATUS_OPTIONS;
  readonly sortOptions = BUILDING_SORT_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  readonly statusQuickFilters = computed(() =>
    mapQuickFilters(STATUS_QUICK_FILTER_OPTIONS, this.listState.statusFilter()),
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
          id: 'archived',
          label: 'Include archived',
          active: this.listState.includeArchived() && status !== 'archived',
        },
      ],
    });
  });

  readonly resultSummary = computed(() => {
    const total = this.listState.listResult().total;
    return `${total} building${total === 1 ? '' : 's'}`;
  });

  readonly statusSummary = computed(() => {
    const by = this.stats().byStatus;
    return (Object.keys(by) as BuildingStatus[])
      .filter((s) => s !== 'archived')
      .map((status) => ({
        status,
        label: BUILDING_STATUS_LABELS[status],
        count: by[status],
      }));
  });

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.listState.setProjectId(id);
      }
    });
  }

  ngOnInit(): void {
    this.listState.setProjectId(this.projectId());
  }

  createBuilding(): void {
    void this.router.navigate([
      '/builder-portal/projects',
      this.projectId(),
      'buildings',
      'create',
    ]);
  }

  backToProject(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId()]);
  }

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onStatus(value: string): void {
    this.listState.setStatusFilter(value as BuildingStatus | 'all');
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onFilterChipRemove(chipId: string): void {
    switch (chipId) {
      case 'search':
        this.listState.setSearch('');
        break;
      case 'status':
        this.listState.setStatusFilter('all');
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
}
