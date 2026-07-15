import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, SearchFieldComponent, SortControlComponent } from '@shared/ui';

import { KpiCardComponent } from '../../components/cards';
import { ChartWrapperComponent } from '../../components/charts';
import { DashboardChartConfig, DashboardKpiItem } from '../../models/dashboard.model';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import {
  HandoverAdvancedFiltersComponent,
  HandoverCardGridComponent,
  HandoverDataGridComponent,
  HandoverQuickFiltersComponent,
  HandoverSavedViewsComponent,
  HandoverViewToggleComponent,
} from '../components/explorer';
import { TimelineCardComponent } from '../components/workflow';
import { HANDOVER_SORT_OPTIONS, HANDOVER_WORKSPACE_HEADER } from '../config/handovers.config';
import { HandoverListStateService } from '../services/handover-list-state.service';
import { HandoverStoreService } from '../services/handover-store.service';

@Component({
  selector: 'app-handover-workspace-page',
  imports: [
    BasePageComponent,
    ButtonComponent,
    PageHeaderComponent,
    SearchFieldComponent,
    SortControlComponent,
    KpiCardComponent,
    ChartWrapperComponent,
    TimelineCardComponent,
    HandoverViewToggleComponent,
    HandoverQuickFiltersComponent,
    HandoverAdvancedFiltersComponent,
    HandoverSavedViewsComponent,
    HandoverCardGridComponent,
    HandoverDataGridComponent,
  ],
  templateUrl: './handover-workspace-page.component.html',
  styleUrl: './handover-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverWorkspacePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(HandoverStoreService);
  private readonly projectStore = inject(ProjectStoreService);
  readonly listState = inject(HandoverListStateService);

  readonly header = HANDOVER_WORKSPACE_HEADER;
  readonly sortOptions = HANDOVER_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly projects = computed(() => this.projectStore.projects());

  private readonly allHandovers = computed(() => this.store.handovers());

  readonly kpis = computed<readonly DashboardKpiItem[]>(() => {
    const handovers = this.allHandovers();
    const inProgress = handovers.filter((h) => h.overallStatus === 'in-progress').length;
    const completed = handovers.filter((h) => h.overallStatus === 'completed').length;
    const delayed = handovers.filter((h) => h.overallStatus === 'delayed').length;
    return [
      { id: 'total', label: 'Total handovers', value: String(handovers.length), icon: 'pi pi-flag', tone: 'primary' },
      { id: 'in-progress', label: 'In progress', value: String(inProgress), icon: 'pi pi-sync', tone: 'info' },
      { id: 'completed', label: 'Completed', value: String(completed), icon: 'pi pi-check-circle', tone: 'success' },
      { id: 'delayed', label: 'Delayed', value: String(delayed), icon: 'pi pi-exclamation-triangle', tone: 'danger' },
    ];
  });

  readonly statusChart = computed<DashboardChartConfig>(() => {
    const handovers = this.allHandovers();
    const labels = ['Pending', 'In progress', 'Delayed', 'Completed'];
    const counts = [
      handovers.filter((h) => h.overallStatus === 'pending').length,
      handovers.filter((h) => h.overallStatus === 'in-progress').length,
      handovers.filter((h) => h.overallStatus === 'delayed').length,
      handovers.filter((h) => h.overallStatus === 'completed').length,
    ];
    return {
      id: 'handover-status',
      type: 'donut',
      title: 'Handover status',
      subtitle: 'All handovers by overall status',
      labels,
      series: [{ label: 'Handovers', values: counts }],
    };
  });

  readonly recentActivity = computed(() =>
    [...this.allHandovers()]
      .flatMap((h) => h.activity.map((item) => ({ ...item, title: `${item.title} — ${h.unitNumber}` })))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 6),
  );

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    this.listState.applyInitialFilter(params.get('projectId'), params.get('unitId'));
  }

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }
}
