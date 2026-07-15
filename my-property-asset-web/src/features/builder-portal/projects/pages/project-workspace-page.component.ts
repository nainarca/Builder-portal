import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, UiToastService } from '@shared/ui';

import { KpiCardComponent, ProgressCardComponent, SummaryCardComponent } from '../../components/cards';
import { ChartWrapperComponent } from '../../components/charts';
import {
  DashboardFooterComponent,
  DashboardGridComponent,
  DashboardGridItemComponent,
  DashboardHeaderComponent,
  DashboardWidgetShellComponent,
} from '../../components/dashboard';
import { CalendarWidgetComponent, QuickActionsWidgetComponent, RecentActivityWidgetComponent } from '../../components/widgets';
import { DashboardChartConfig, DashboardProjectSummaryItem, DashboardQuickActionItem, DashboardSummaryItem } from '../../models/dashboard.model';
import {
  PROJECT_WORKSPACE_ACTIVITIES,
  PROJECT_WORKSPACE_HEADER,
  PROJECT_WORKSPACE_KPIS,
  PROJECT_WORKSPACE_QUICK_ACTIONS,
} from '../config/projects.config';
import { ProjectCardGridComponent } from '../components/list/project-card-grid.component';
import { Project } from '../models/project.model';
import { ProjectListStateService } from '../services/project-list-state.service';
import { ProjectStoreService } from '../services/project-store.service';

const STAGE_LABELS: Record<Project['constructionStage'], string> = {
  'land-acquisition': 'Land acquisition',
  foundation: 'Foundation',
  structure: 'Structure',
  finishing: 'Finishing',
  handover: 'Handover',
  completed: 'Completed',
};

@Component({
  selector: 'app-project-workspace-page',
  imports: [
    BasePageComponent,
    DashboardHeaderComponent,
    DashboardGridComponent,
    DashboardGridItemComponent,
    DashboardWidgetShellComponent,
    DashboardFooterComponent,
    KpiCardComponent,
    SummaryCardComponent,
    ProgressCardComponent,
    ProjectCardGridComponent,
    ChartWrapperComponent,
    QuickActionsWidgetComponent,
    RecentActivityWidgetComponent,
    CalendarWidgetComponent,
  ],
  templateUrl: './project-workspace-page.component.html',
  styleUrl: './project-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectWorkspacePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(ProjectStoreService);
  readonly listState = inject(ProjectListStateService);
  private readonly toast = inject(UiToastService);

  readonly header = PROJECT_WORKSPACE_HEADER;
  readonly kpis = PROJECT_WORKSPACE_KPIS;
  readonly quickActions = PROJECT_WORKSPACE_QUICK_ACTIONS;
  readonly activities = PROJECT_WORKSPACE_ACTIVITIES;

  readonly pinnedActionIds = this.quickActions.filter((a) => a.pinned).map((a) => a.id);
  readonly favoriteActionIds = this.quickActions.filter((a) => a.favorite).map((a) => a.id);

  private readonly activeProjects = computed(() =>
    this.store.projects().filter((p) => !p.archived),
  );

  readonly healthSummary = computed<readonly DashboardSummaryItem[]>(() => {
    const projects = this.activeProjects();
    const onTrack = projects.filter((p) => p.health === 'on-track').length;
    const atRisk = projects.filter((p) => p.health === 'at-risk').length;
    const delayed = projects.filter((p) => p.health === 'delayed').length;
    return [
      { id: 'health-on-track', title: 'On track', value: String(onTrack), subtitle: 'Healthy delivery pace', icon: 'pi pi-heart-fill' },
      { id: 'health-at-risk', title: 'At risk', value: String(atRisk), subtitle: 'Needs attention soon', icon: 'pi pi-exclamation-triangle' },
      { id: 'health-delayed', title: 'Delayed', value: String(delayed), subtitle: 'Behind schedule', icon: 'pi pi-clock' },
    ];
  });

  readonly recentProjects = computed(() =>
    [...this.activeProjects()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
  );

  readonly favoriteProjects = computed(() => {
    const ids = new Set(this.listState.favoriteIds());
    return this.activeProjects().filter((p) => ids.has(p.id));
  });

  readonly constructionStatusChart = computed<DashboardChartConfig>(() => {
    const projects = this.activeProjects();
    const counts = new Map<string, number>();
    for (const project of projects) {
      const label = STAGE_LABELS[project.constructionStage];
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    const labels = Object.values(STAGE_LABELS).filter((label) => counts.has(label));
    return {
      id: 'construction-status',
      type: 'donut',
      title: 'Construction status',
      subtitle: 'Active projects by construction stage',
      labels,
      series: [{ label: 'Projects', values: labels.map((label) => counts.get(label) ?? 0) }],
    };
  });

  readonly lowestProgressProjects = computed<readonly DashboardProjectSummaryItem[]>(() =>
    [...this.activeProjects()]
      .filter((p) => p.status !== 'completed')
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 3)
      .map((project) => this.toDashboardProjectSummary(project)),
  );

  onQuickActionSelected(action: DashboardQuickActionItem): void {
    if (action.route) {
      void this.router.navigateByUrl(action.route);
      return;
    }
    this.toast.info(action.label, 'This area is coming in a future module.');
  }

  onFavoriteToggle(id: string): void {
    this.listState.toggleFavorite(id);
  }

  private toDashboardProjectSummary(project: Project): DashboardProjectSummaryItem {
    return {
      id: project.id,
      name: project.name,
      location: project.location.city,
      status: project.status,
      progress: project.progress,
      unitsTotal: project.summary.unitsTotal,
      unitsSold: project.summary.unitsSold,
    };
  }
}
