import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent } from '@shared/ui';

import {
  SUPER_ADMIN_DASHBOARD_ACTIVITIES,
  SUPER_ADMIN_DASHBOARD_ANNOUNCEMENTS,
  SUPER_ADMIN_DASHBOARD_FILTERS,
  SUPER_ADMIN_DASHBOARD_HEADER,
  SUPER_ADMIN_DASHBOARD_KPIS,
  SUPER_ADMIN_DASHBOARD_QUICK_ACTIONS,
  SUPER_ADMIN_DASHBOARD_STATUSES,
  SUPER_ADMIN_DASHBOARD_SUMMARIES,
  SUPER_ADMIN_DASHBOARD_TRENDS,
  SUPER_ADMIN_DONUT_CHART,
  SUPER_ADMIN_ORG_CHART,
  SUPER_ADMIN_USAGE_CHART,
} from './config/super-admin-dashboard.config';
import {
  KpiCardComponent,
  TrendCardComponent,
} from './components/cards';
import {
  DashboardFiltersComponent,
  DashboardFooterComponent,
  DashboardGridComponent,
  DashboardGridItemComponent,
  DashboardHeaderComponent,
  DashboardToolbarComponent,
} from './components/dashboard';
import {
  AnnouncementsWidgetComponent,
  BuilderSummaryWidgetComponent,
  OrganizationsChartWidgetComponent,
  OrganizationSummaryWidgetComponent,
  PlatformStatusWidgetComponent,
  QuickActionsWidgetComponent,
  RecentActivityWidgetComponent,
  SystemHealthWidgetComponent,
  UsageChartWidgetComponent,
  UsageOverviewWidgetComponent,
  UserSummaryWidgetComponent,
} from './components/widgets';
import { DashboardWidgetId } from './models/dashboard.model';
import { DashboardPreferencesService } from './services/dashboard-preferences.service';
import { WidgetLoaderService } from './services/widget-loader.service';

@Component({
  selector: 'app-super-admin-dashboard',
  imports: [
    BasePageComponent,
    DashboardHeaderComponent,
    DashboardToolbarComponent,
    DashboardFiltersComponent,
    DashboardGridComponent,
    DashboardGridItemComponent,
    DashboardFooterComponent,
    KpiCardComponent,
    TrendCardComponent,
    QuickActionsWidgetComponent,
    UsageChartWidgetComponent,
    OrganizationsChartWidgetComponent,
    PlatformStatusWidgetComponent,
    SystemHealthWidgetComponent,
    RecentActivityWidgetComponent,
    AnnouncementsWidgetComponent,
    OrganizationSummaryWidgetComponent,
    BuilderSummaryWidgetComponent,
    UserSummaryWidgetComponent,
    UsageOverviewWidgetComponent,
  ],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperAdminDashboardComponent {
  private readonly router = inject(Router);
  private readonly preferences = inject(DashboardPreferencesService);
  private readonly widgetLoader = inject(WidgetLoaderService);

  readonly header = SUPER_ADMIN_DASHBOARD_HEADER;
  readonly kpis = SUPER_ADMIN_DASHBOARD_KPIS;
  readonly trends = SUPER_ADMIN_DASHBOARD_TRENDS;
  readonly statuses = SUPER_ADMIN_DASHBOARD_STATUSES;
  readonly activities = SUPER_ADMIN_DASHBOARD_ACTIVITIES;
  readonly announcements = SUPER_ADMIN_DASHBOARD_ANNOUNCEMENTS;
  readonly quickActions = SUPER_ADMIN_DASHBOARD_QUICK_ACTIONS;
  readonly filters = SUPER_ADMIN_DASHBOARD_FILTERS;
  readonly usageChart = SUPER_ADMIN_USAGE_CHART;
  readonly orgChart = SUPER_ADMIN_ORG_CHART;
  readonly usageDonutChart = SUPER_ADMIN_DONUT_CHART;

  readonly selectedFilter = signal('30d');
  readonly refreshingAll = signal(false);

  readonly visibleWidgets = this.preferences.visibleWidgets;
  readonly pinnedActionIds = computed(() => this.preferences.preferences().pinnedActions);
  readonly favoriteActionIds = computed(() => this.preferences.preferences().favoriteActions);

  readonly orgSummary = computed(
    () => SUPER_ADMIN_DASHBOARD_SUMMARIES.find((item) => item.id === 'org-summary')!,
  );
  readonly builderSummary = computed(
    () => SUPER_ADMIN_DASHBOARD_SUMMARIES.find((item) => item.id === 'builder-summary')!,
  );
  readonly userSummary = computed(
    () => SUPER_ADMIN_DASHBOARD_SUMMARIES.find((item) => item.id === 'user-summary')!,
  );

  readonly lastRefreshedLabel = computed(() => {
    const timestamp = this.preferences.preferences().lastRefreshedAt;
    if (!timestamp) {
      return undefined;
    }
    return new Date(timestamp).toLocaleString();
  });

  isVisible(id: DashboardWidgetId): boolean {
    return this.visibleWidgets().some((widget) => widget.id === id);
  }

  isLoading(id: DashboardWidgetId): boolean {
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

  async onRefreshWidget(id: DashboardWidgetId): Promise<void> {
    await this.widgetLoader.refreshWidget(id);
  }

  onQuickActionSelected(action: (typeof SUPER_ADMIN_DASHBOARD_QUICK_ACTIONS)[number]): void {
    if (action.route) {
      void this.router.navigateByUrl(action.route);
    }
  }
}
