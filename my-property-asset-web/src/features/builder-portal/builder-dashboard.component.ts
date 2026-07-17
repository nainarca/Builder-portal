import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '@core/auth';
import { CurrentOrganizationService } from '@core/organization-context';
import {
  EnterpriseDashboardGridComponent,
  EnterpriseDashboardGridItemComponent,
  EnterpriseDashboardKpiStripComponent,
  EnterpriseDashboardSectionComponent,
  EnterpriseDashboardShellComponent,
  EnterpriseKpiPrimaryComponent,
  OutlineButtonComponent,
  UiToastService,
} from '@shared/ui';

import { KpiCardComponent, SummaryCardComponent } from './components/cards';
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
import { BuilderPortalPageComponent } from './components/layout';
import {
  BuilderWelcomeComponent,
  DashboardGridComponent,
  DashboardGridItemComponent,
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
import { BuilderBrandingService } from './branding/services/builder-branding.service';
import { CommunicationDashboardService } from './communications/services/communication-dashboard.service';
import { SubscriptionService } from './subscription/services/subscription.service';
import { resolveDisplayName, resolveTimeGreeting } from './utils/display-name.util';

@Component({
  selector: 'app-builder-dashboard',
  imports: [
    DatePipe,
    BuilderPortalPageComponent,
    EnterpriseDashboardShellComponent,
    EnterpriseDashboardKpiStripComponent,
    EnterpriseDashboardSectionComponent,
    EnterpriseDashboardGridComponent,
    EnterpriseDashboardGridItemComponent,
    EnterpriseKpiPrimaryComponent,
    OutlineButtonComponent,
    BuilderWelcomeComponent,
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
  private readonly branding = inject(BuilderBrandingService);
  private readonly communicationDashboard = inject(CommunicationDashboardService);
  private readonly subscriptionService = inject(SubscriptionService);
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
        trend: undefined,
        trendLabel: undefined,
      },
      {
        id: 'construction',
        label: 'Construction',
        value: String(stats.byStatus.construction),
        hint: 'Under construction',
      },
      {
        id: 'planning',
        label: 'Planning / Upcoming',
        value: String(stats.byStatus.planning + stats.byStatus.upcoming),
        hint: 'Pre-construction',
      },
      {
        id: 'completed',
        label: 'Completed',
        value: String(stats.byStatus.completed),
        hint: 'Delivered projects',
        trend: 'up' as const,
        trendLabel: 'Portfolio health',
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

  readonly brandingCompletion = this.branding.completion;
  readonly brandingProfile = this.branding.activeBranding;
  readonly communicationSummary = this.communicationDashboard.summary;
  readonly subscriptionSummary = this.subscriptionService.summary;

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

  subscriptionUsageLabel(): string {
    const summary = this.subscriptionSummary();
    const limit = summary.plan?.limits?.projects;
    return `${summary.usage.projects} / ${limit ?? '—'} projects`;
  }

  subscriptionRemainingLabel(): string {
    const summary = this.subscriptionSummary();
    const days = summary.daysUntilExpiry ?? '—';
    const units = typeof summary.remaining.units === 'number' ? summary.remaining.units : '—';
    return `${days} days to renewal · ${units} units remaining`;
  }
}
