import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  EnterpriseDashboardGridComponent,
  EnterpriseDashboardGridItemComponent,
  EnterpriseDashboardKpiStripComponent,
  EnterpriseDashboardSectionComponent,
  EnterpriseDashboardShellComponent,
  EnterpriseKpiPrimaryComponent,
  OutlineButtonComponent,
} from '@shared/ui';

import { SuperAdminPageComponent } from './components/layout';
import {
  SUPER_ADMIN_DASHBOARD_ANNOUNCEMENTS,
  SUPER_ADMIN_DASHBOARD_FILTERS,
  SUPER_ADMIN_DASHBOARD_HEADER,
  SUPER_ADMIN_DASHBOARD_QUICK_ACTIONS,
  SUPER_ADMIN_DASHBOARD_STATUSES,
  SUPER_ADMIN_DONUT_CHART,
  SUPER_ADMIN_ORG_CHART,
  SUPER_ADMIN_USAGE_CHART,
} from './config/super-admin-dashboard.config';
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
import { PlatformMetricsService } from './platform/services/platform-metrics.service';
import { PlatformAuditService } from './platform/services/platform-audit.service';
import { SupportTicketService } from './platform/services/support-ticket.service';

@Component({
  selector: 'app-super-admin-dashboard',
  imports: [
    SuperAdminPageComponent,
    EnterpriseDashboardShellComponent,
    EnterpriseDashboardKpiStripComponent,
    EnterpriseDashboardSectionComponent,
    EnterpriseDashboardGridComponent,
    EnterpriseDashboardGridItemComponent,
    EnterpriseKpiPrimaryComponent,
    OutlineButtonComponent,
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
  private readonly metrics = inject(PlatformMetricsService);
  private readonly audit = inject(PlatformAuditService);
  private readonly support = inject(SupportTicketService);

  readonly header = SUPER_ADMIN_DASHBOARD_HEADER;
  readonly statuses = SUPER_ADMIN_DASHBOARD_STATUSES;
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

  readonly metricsSnapshot = this.metrics.snapshot;

  readonly kpis = computed(() => {
    const m = this.metricsSnapshot();
    return [
      {
        id: 'builders',
        label: 'Total Builders',
        value: String(m.totalBuilders),
        hint: `${m.activeBuilders} active`,
        trend: 'up' as const,
        trendLabel: `+${m.monthlyGrowthPercent}% growth signal`,
      },
      {
        id: 'trial',
        label: 'Trial Builders',
        value: String(m.trialBuilders),
        hint: `${m.expiredBuilders} expired / archived`,
      },
      {
        id: 'projects',
        label: 'Total Projects',
        value: String(m.totalProjects),
        hint: `${m.totalUnits} units`,
      },
      {
        id: 'health',
        label: 'Platform Health',
        value: m.platformHealth,
        hint: `${m.storageUsageGb} GB storage`,
      },
    ];
  });

  readonly trends = computed(() => {
    const m = this.metricsSnapshot();
    return [
      {
        id: 'owners',
        label: 'Active owners',
        value: String(m.totalActiveOwners),
        change: `+${m.monthlyGrowthPercent}%`,
        trend: 'up' as const,
        period: 'Portfolio',
      },
      {
        id: 'handovers',
        label: 'Digital handovers',
        value: String(m.totalDigitalHandovers),
        change: '+8%',
        trend: 'up' as const,
        period: 'Estimated',
      },
      {
        id: 'support',
        label: 'Support tickets',
        value: String(m.openSupportTickets),
        change: this.support.openCount() > 0 ? 'Open queue' : 'Clear',
        trend: this.support.openCount() > 0 ? ('down' as const) : ('up' as const),
        period: 'Support Center',
      },
    ];
  });

  readonly activities = computed(() =>
    this.audit.list(8).map((event) => ({
      id: event.id,
      title: event.summary,
      description: `${event.category} · ${event.action}`,
      timestamp: new Date(event.createdAt).toLocaleString(),
      icon: 'pi pi-history',
      tone: 'info' as const,
    })),
  );

  readonly orgSummary = computed(() => ({
    id: 'org-summary',
    title: 'Active subscriptions',
    value: String(this.metricsSnapshot().activeSubscriptions),
    subtitle: `${this.metricsSnapshot().trialBuilders} on trial`,
    icon: 'pi pi-credit-card',
  }));

  readonly builderSummary = computed(() => ({
    id: 'builder-summary',
    title: 'Builders',
    value: String(this.metricsSnapshot().totalBuilders),
    subtitle: `${this.metricsSnapshot().suspendedBuilders} suspended`,
    icon: 'pi pi-building',
  }));

  readonly userSummary = computed(() => ({
    id: 'user-summary',
    title: 'Active owners',
    value: String(this.metricsSnapshot().totalActiveOwners),
    subtitle: `${this.metricsSnapshot().totalDigitalHandovers} handovers`,
    icon: 'pi pi-users',
  }));

  readonly lastRefreshedLabel = computed(() => {
    const timestamp = this.preferences.preferences().lastRefreshedAt;
    if (!timestamp) {
      return undefined;
    }
    return new Date(timestamp).toLocaleString();
  });

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
