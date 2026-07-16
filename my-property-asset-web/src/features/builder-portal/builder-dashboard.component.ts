import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '@core/auth';
import { CurrentOrganizationService } from '@core/organization-context';
import { BasePageComponent, UiToastService } from '@shared/ui';

import {
  BUILDER_DASHBOARD_ACTIVITIES,
  BUILDER_DASHBOARD_APPOINTMENTS,
  BUILDER_DASHBOARD_FILTERS,
  BUILDER_DASHBOARD_HEADER,
  BUILDER_DASHBOARD_NOTIFICATIONS,
  BUILDER_DASHBOARD_QUICK_ACTIONS,
  BUILDER_DASHBOARD_SUMMARIES,
  BUILDER_DASHBOARD_TRENDS,
} from './config/builder-dashboard.config';
import { KpiCardComponent, SummaryCardComponent } from './components/cards';
import {
  BuilderWelcomeComponent,
  DashboardFiltersComponent,
  DashboardFooterComponent,
  DashboardGridComponent,
  DashboardGridItemComponent,
  DashboardHeaderComponent,
  DashboardToolbarComponent,
} from './components/dashboard';
import {
  CalendarWidgetComponent,
  NotificationsWidgetComponent,
  PerformanceSummaryWidgetComponent,
  ProjectProgressWidgetComponent,
  ProjectStatusOverviewWidgetComponent,
  QuickActionsWidgetComponent,
  RecentActivityWidgetComponent,
  RecentProjectsWidgetComponent,
  TodaysActivitiesWidgetComponent,
  UpcomingAppointmentsWidgetComponent,
} from './components/widgets';
import { BuilderDashboardWidgetId, DashboardQuickActionItem } from './models/dashboard.model';
import { DashboardPreferencesService } from './services/dashboard-preferences.service';
import { WidgetLoaderService } from './services/widget-loader.service';
import { ProjectStoreService } from './projects/services/project-store.service';
import { resolveDisplayName, resolveTimeGreeting } from './utils/display-name.util';

@Component({
  selector: 'app-builder-dashboard',
  imports: [
    BasePageComponent,
    BuilderWelcomeComponent,
    DashboardHeaderComponent,
    DashboardToolbarComponent,
    DashboardFiltersComponent,
    DashboardGridComponent,
    DashboardGridItemComponent,
    DashboardFooterComponent,
    KpiCardComponent,
    SummaryCardComponent,
    QuickActionsWidgetComponent,
    RecentProjectsWidgetComponent,
    ProjectStatusOverviewWidgetComponent,
    ProjectProgressWidgetComponent,
    PerformanceSummaryWidgetComponent,
    RecentActivityWidgetComponent,
    TodaysActivitiesWidgetComponent,
    UpcomingAppointmentsWidgetComponent,
    NotificationsWidgetComponent,
    CalendarWidgetComponent,
  ],
  templateUrl: './builder-dashboard.component.html',
  styleUrl: './builder-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderDashboardComponent {
  private readonly router = inject(Router);
  private readonly preferences = inject(DashboardPreferencesService);
  private readonly widgetLoader = inject(WidgetLoaderService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly projectStore = inject(ProjectStoreService);
  private readonly toast = inject(UiToastService);

  readonly header = BUILDER_DASHBOARD_HEADER;
  readonly summaries = BUILDER_DASHBOARD_SUMMARIES;
  readonly activities = BUILDER_DASHBOARD_ACTIVITIES;
  readonly appointments = BUILDER_DASHBOARD_APPOINTMENTS;
  readonly notifications = BUILDER_DASHBOARD_NOTIFICATIONS;
  readonly trends = BUILDER_DASHBOARD_TRENDS;
  readonly quickActions = BUILDER_DASHBOARD_QUICK_ACTIONS;
  readonly filters = BUILDER_DASHBOARD_FILTERS;

  readonly selectedFilter = signal('30d');
  readonly refreshingAll = signal(false);

  readonly visibleWidgets = this.preferences.visibleWidgets;
  readonly pinnedActionIds = computed(() => this.preferences.preferences().pinnedActions);
  readonly favoriteActionIds = computed(() => this.preferences.preferences().favoriteActions);

  readonly greeting = computed(() => resolveTimeGreeting());
  readonly displayName = computed(() => resolveDisplayName(this.currentUser.user()));
  readonly organizationName = computed(() => this.currentOrganization.organizationName());
  readonly today = computed(() =>
    new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
  );

  readonly lastRefreshedLabel = computed(() => {
    const timestamp = this.preferences.preferences().lastRefreshedAt;
    if (!timestamp) {
      return undefined;
    }
    return new Date(timestamp).toLocaleString();
  });

  private readonly projectStats = computed(() => this.projectStore.dashboardStats());

  readonly kpis = computed(() => {
    const stats = this.projectStats();
    return [
      {
        id: 'total-projects',
        label: 'Total Projects',
        value: String(stats.total),
        hint: 'Active portfolio',
        icon: 'pi pi-briefcase',
        tone: 'primary' as const,
      },
      {
        id: 'construction',
        label: 'Construction',
        value: String(stats.byStatus.construction),
        hint: 'Under construction',
        icon: 'pi pi-hammer',
        tone: 'info' as const,
      },
      {
        id: 'planning',
        label: 'Planning / Upcoming',
        value: String(stats.byStatus.planning + stats.byStatus.upcoming),
        hint: 'Pre-construction',
        icon: 'pi pi-map',
        tone: 'warning' as const,
      },
      {
        id: 'completed',
        label: 'Completed',
        value: String(stats.byStatus.completed),
        hint: 'Delivered projects',
        icon: 'pi pi-check-circle',
        tone: 'success' as const,
      },
    ];
  });

  readonly recentProjects = computed(() =>
    this.projectStats().recent.map((p) => ({
      id: p.id,
      name: p.name,
      location: `${p.location.city}, ${p.location.state}`,
      status: p.status,
      projectType: p.projectType,
      unitsTotal: p.summary.unitsTotal,
      unitsSold: p.summary.unitsSold,
    })),
  );

  readonly statusChart = computed(() => {
    const by = this.projectStats().byStatus;
    return {
      id: 'project-status-overview',
      type: 'donut' as const,
      title: 'Project status overview',
      subtitle: 'Live portfolio distribution',
      labels: ['Upcoming', 'Planning', 'Construction', 'Completed'],
      series: [
        {
          label: 'Projects',
          values: [by.upcoming, by.planning, by.construction, by.completed],
        },
      ],
    };
  });

  isVisible(id: BuilderDashboardWidgetId): boolean {
    return this.visibleWidgets().some((widget) => widget.id === id);
  }

  isLoading(id: BuilderDashboardWidgetId): boolean {
    return this.widgetLoader.isLoading(id);
  }

  onFilterChange(value: string): void {
    this.selectedFilter.set(value);
  }

  async onRefreshAll(): Promise<void> {
    this.refreshingAll.set(true);
    const ids = this.visibleWidgets().map((widget) => widget.id);
    await this.widgetLoader.refreshAll(ids);
    this.preferences.markRefreshed();
    this.refreshingAll.set(false);
  }

  async onRefreshWidget(id: BuilderDashboardWidgetId): Promise<void> {
    await this.widgetLoader.refreshWidget(id);
  }

  onQuickActionSelected(action: DashboardQuickActionItem): void {
    if (action.route) {
      void this.router.navigateByUrl(action.route);
      return;
    }
    this.toast.info(action.label, 'This area is coming in a future module.');
  }
}
