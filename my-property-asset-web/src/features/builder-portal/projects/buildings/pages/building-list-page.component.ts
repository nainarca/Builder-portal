import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { HasPermissionDirective } from '@core/rbac';
import {
  BasePageComponent,
  ButtonComponent,
  PageHeaderComponent,
  SearchFieldComponent,
  SelectComponent,
  SelectOption,
} from '@shared/ui';

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

@Component({
  selector: 'app-building-list-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    ButtonComponent,
    SearchFieldComponent,
    SelectComponent,
    RouterLink,
    HasPermissionDirective,
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
    return project ? resolveBuildingMode(project.projectType) : 'optional';
  });
  readonly buildingsRequired = computed(() => {
    const project = this.project();
    return project ? buildingsAreRequired(project.projectType) : false;
  });

  readonly statusOptions: readonly SelectOption[] = BUILDING_STATUS_OPTIONS;
  readonly sortOptions: readonly SelectOption[] = BUILDING_SORT_OPTIONS;

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
}
