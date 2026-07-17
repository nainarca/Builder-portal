import { BuilderPortalPageComponent } from '../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { UiToastService } from '@shared/ui';

import { KpiCardComponent, SummaryCardComponent } from '../../components/cards';
import { ChartWrapperComponent } from '../../components/charts';
import {
  DashboardFooterComponent,
  DashboardGridComponent,
  DashboardGridItemComponent,
  DashboardHeaderComponent,
  DashboardWidgetShellComponent } from '../../components/dashboard';
import {
  CalendarWidgetComponent,
  QuickActionsWidgetComponent,
  RecentActivityWidgetComponent } from '../../components/widgets';
import {
  DashboardChartConfig,
  DashboardKpiItem,
  DashboardProjectSummaryItem,
  DashboardQuickActionItem,
  DashboardSummaryItem } from '../../models/dashboard.model';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_WORKSPACE_ACTIVITIES,
  PROJECT_WORKSPACE_HEADER,
  PROJECT_WORKSPACE_QUICK_ACTIONS } from '../config/projects.config';
import { ProjectCardGridComponent } from '../components/list/project-card-grid.component';
import { Project, ProjectStatus } from '../models/project.model';
import { ProjectListStateService } from '../services/project-list-state.service';
import { ProjectStoreService } from '../services/project-store.service';

@Component({
  selector: 'app-project-workspace-page',
  imports: [ BuilderPortalPageComponent,
    DashboardHeaderComponent,
    DashboardGridComponent,
    DashboardGridItemComponent,
    DashboardWidgetShellComponent,
    DashboardFooterComponent,
    KpiCardComponent,
    SummaryCardComponent,
    ProjectCardGridComponent,
    ChartWrapperComponent,
    QuickActionsWidgetComponent,
    RecentActivityWidgetComponent,
    CalendarWidgetComponent,
  ],
  templateUrl: './project-workspace-page.component.html',
  styleUrl: './project-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class ProjectWorkspacePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(ProjectStoreService);
  readonly listState = inject(ProjectListStateService);
  private readonly toast = inject(UiToastService);

  readonly header = PROJECT_WORKSPACE_HEADER;
  readonly quickActions = PROJECT_WORKSPACE_QUICK_ACTIONS;
  readonly activities = PROJECT_WORKSPACE_ACTIVITIES;

  readonly pinnedActionIds = this.quickActions.filter((a) => a.pinned).map((a) => a.id);
  readonly favoriteActionIds = this.quickActions.filter((a) => a.favorite).map((a) => a.id);

  private readonly stats = computed(() => this.store.dashboardStats());

  readonly kpis = computed<readonly DashboardKpiItem[]>(() => {
    const s = this.stats();
    return [
      {
        id: 'total-projects',
        label: 'Total projects',
        value: String(s.total),
        hint: 'Active portfolio',
        icon: 'pi pi-briefcase',
        tone: 'primary' },
      {
        id: 'construction',
        label: 'Construction',
        value: String(s.byStatus.construction),
        hint: 'In construction',
        icon: 'pi pi-hammer',
        tone: 'info' },
      {
        id: 'planning',
        label: 'Planning',
        value: String(s.byStatus.planning + s.byStatus.upcoming),
        hint: 'Upcoming + planning',
        icon: 'pi pi-map',
        tone: 'warning' },
      {
        id: 'completed',
        label: 'Completed',
        value: String(s.byStatus.completed),
        hint: 'Delivered',
        icon: 'pi pi-check-circle',
        tone: 'success' },
    ];
  });

  readonly statusSummary = computed<readonly DashboardSummaryItem[]>(() => {
    const by = this.stats().byStatus;
    return (Object.keys(by) as ProjectStatus[])
      .filter((status) => status !== 'archived')
      .map((status) => ({
        id: `status-${status}`,
        title: PROJECT_STATUS_LABELS[status] ?? status,
        value: String(by[status]),
        subtitle: 'Projects',
        icon: 'pi pi-briefcase' }));
  });

  readonly recentProjects = computed(() => this.stats().recent.slice(0, 4));

  readonly favoriteProjects = computed(() => {
    const ids = new Set(this.listState.favoriteIds());
    return this.store.projects().filter((p) => !p.archived && ids.has(p.id));
  });

  readonly statusChart = computed<DashboardChartConfig>(() => {
    const by = this.stats().byStatus;
    const labels = ['Upcoming', 'Planning', 'Construction', 'Completed'];
    const keys: ProjectStatus[] = ['upcoming', 'planning', 'construction', 'completed'];
    return {
      id: 'project-status',
      type: 'donut',
      title: 'Projects by status',
      subtitle: 'Active portfolio distribution',
      labels,
      series: [{ label: 'Projects', values: keys.map((k) => by[k]) }] };
  });

  readonly spotlightProjects = computed<readonly DashboardProjectSummaryItem[]>(() =>
    this.stats()
      .recent.filter((p) => p.status !== 'completed')
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
      projectType: project.projectType,
      unitsTotal: project.summary.unitsTotal,
      unitsSold: project.summary.unitsSold };
  }
}
