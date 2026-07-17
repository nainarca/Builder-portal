import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  EnterpriseDashboardAttentionListComponent,
  EnterpriseDashboardGridComponent,
  EnterpriseDashboardGridItemComponent,
  EnterpriseDashboardKpiStripComponent,
  EnterpriseDashboardShellComponent,
  EnterpriseKpiPrimaryComponent,
  OutlineButtonComponent,
  type EnterpriseDashboardAttentionItem,
} from '@shared/ui';

import { SuperAdminPageComponent } from './components/layout';
import {
  SUPER_ADMIN_DASHBOARD_ANNOUNCEMENTS,
  SUPER_ADMIN_DASHBOARD_FILTERS,
  SUPER_ADMIN_DASHBOARD_HEADER,
  SUPER_ADMIN_DASHBOARD_QUICK_ACTIONS,
  SUPER_ADMIN_DASHBOARD_STATUSES,
} from './config/super-admin-dashboard.config';
import {
  AnnouncementsWidgetComponent,
  PlatformStatusWidgetComponent,
  QuickActionsWidgetComponent,
  RecentActivityWidgetComponent,
  SystemHealthWidgetComponent,
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
    EnterpriseDashboardAttentionListComponent,
    EnterpriseDashboardGridComponent,
    EnterpriseDashboardGridItemComponent,
    EnterpriseKpiPrimaryComponent,
    OutlineButtonComponent,
    QuickActionsWidgetComponent,
    PlatformStatusWidgetComponent,
    SystemHealthWidgetComponent,
    RecentActivityWidgetComponent,
    AnnouncementsWidgetComponent,
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

  readonly selectedFilter = signal('30d');
  readonly refreshingAll = signal(false);

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

  /** Exception-first attention — not a second KPI strip (UI-REBIRTH §11 / §20 #9). */
  readonly attentionItems = computed((): EnterpriseDashboardAttentionItem[] => {
    const m = this.metricsSnapshot();
    const items: EnterpriseDashboardAttentionItem[] = [];
    const openTickets = this.support.openCount();

    if (openTickets > 0) {
      items.push({
        id: 'support-queue',
        title: `${openTickets} open support tickets`,
        description: 'Builders waiting on platform intervention.',
        severity: 'error',
        icon: 'pi pi-headphones',
        actionLabel: 'Open Support',
        href: '/super-admin/support',
      });
    }

    if (m.suspendedBuilders > 0) {
      items.push({
        id: 'suspended-builders',
        title: `${m.suspendedBuilders} suspended builders`,
        description: 'Accounts that may need reactivation or follow-up.',
        severity: 'warn',
        icon: 'pi pi-building',
        actionLabel: 'Review builders',
        href: '/super-admin/builders',
      });
    }

    if (m.trialBuilders > 0) {
      items.push({
        id: 'trial-builders',
        title: `${m.trialBuilders} builders on trial`,
        description: 'Watch conversion and expiry risk across the trial cohort.',
        severity: 'info',
        icon: 'pi pi-clock',
        actionLabel: 'Review builders',
        href: '/super-admin/builders',
      });
    }

    for (const status of this.statuses) {
      if (status.status === 'degraded' || status.status === 'critical') {
        items.push({
          id: `status-${status.id}`,
          title: `${status.label} is ${status.status}`,
          description: status.detail,
          severity: status.status === 'critical' ? 'error' : 'warn',
          icon: status.icon ?? 'pi pi-server',
          actionLabel: 'Operations',
          href: '/super-admin/operations/health',
        });
      }
    }

    return items;
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
    const ids: DashboardWidgetId[] = [
      'recent-activity',
      'platform-status',
      'system-health',
    ];
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

  onAttentionAction(id: string): void {
    const item = this.attentionItems().find((entry) => entry.id === id);
    if (item?.href) {
      void this.router.navigateByUrl(item.href);
    }
  }
}
