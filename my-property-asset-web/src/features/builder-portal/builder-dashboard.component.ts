import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '@core/auth';
import { CurrentOrganizationService } from '@core/organization-context';
import {
  EnterpriseDashboardAccountHealthComponent,
  EnterpriseDashboardAttentionListComponent,
  EnterpriseDashboardGridComponent,
  EnterpriseDashboardGridItemComponent,
  EnterpriseDashboardKpiStripComponent,
  EnterpriseDashboardShellComponent,
  EnterpriseKpiPrimaryComponent,
  OutlineButtonComponent,
  UiToastService,
  type EnterpriseDashboardAccountHealth,
  type EnterpriseDashboardAttentionItem,
} from '@shared/ui';

import {
  BUILDER_DASHBOARD_ACTIVITIES,
  BUILDER_DASHBOARD_FILTERS,
  BUILDER_DASHBOARD_HEADER,
  BUILDER_DASHBOARD_QUICK_ACTIONS,
  BUILDER_DASHBOARD_SUMMARIES,
} from './config/builder-dashboard.config';
import { BuilderPortalPageComponent } from './components/layout';
import { BuilderWelcomeComponent } from './components/dashboard';
import {
  ProjectProgressWidgetComponent,
  ProjectStatusOverviewWidgetComponent,
  QuickActionsWidgetComponent,
  RecentActivityWidgetComponent,
  RecentProjectsWidgetComponent,
} from './components/widgets';
import { BuilderDashboardWidgetId, DashboardQuickActionItem } from './models/dashboard.model';
import { DashboardPreferencesService } from './services/dashboard-preferences.service';
import { WidgetLoaderService } from './services/widget-loader.service';
import { ProjectStoreService } from './projects/services/project-store.service';
import { BuilderBrandingService } from './branding/services/builder-branding.service';
import { resolveDisplayName, resolveTimeGreeting } from './utils/display-name.util';

@Component({
  selector: 'app-builder-dashboard',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseDashboardShellComponent,
    EnterpriseDashboardKpiStripComponent,
    EnterpriseDashboardGridComponent,
    EnterpriseDashboardGridItemComponent,
    EnterpriseDashboardAttentionListComponent,
    EnterpriseDashboardAccountHealthComponent,
    EnterpriseKpiPrimaryComponent,
    OutlineButtonComponent,
    BuilderWelcomeComponent,
    QuickActionsWidgetComponent,
    RecentProjectsWidgetComponent,
    ProjectStatusOverviewWidgetComponent,
    ProjectProgressWidgetComponent,
    RecentActivityWidgetComponent,
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
  private readonly toast = inject(UiToastService);

  readonly header = BUILDER_DASHBOARD_HEADER;
  readonly activities = BUILDER_DASHBOARD_ACTIVITIES;
  readonly quickActions = BUILDER_DASHBOARD_QUICK_ACTIONS;
  readonly filters = BUILDER_DASHBOARD_FILTERS;

  readonly selectedFilter = signal('30d');
  readonly refreshingAll = signal(false);

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
        trend: undefined as undefined,
        trendLabel: undefined as undefined,
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

  /** Operational attention only — no branding/subscription/communication cards (UI-REBIRTH §3). */
  readonly attentionItems = computed((): EnterpriseDashboardAttentionItem[] => {
    const items: EnterpriseDashboardAttentionItem[] = [];
    const stats = this.projectStats();
    const handovers = BUILDER_DASHBOARD_SUMMARIES.find((s) => s.id === 'handover-summary');
    const snags = BUILDER_DASHBOARD_SUMMARIES.find((s) => s.id === 'snag-summary');
    const owners = BUILDER_DASHBOARD_SUMMARIES.find((s) => s.id === 'owner-summary');

    if (handovers) {
      items.push({
        id: 'pending-handovers',
        title: `${handovers.value} pending handovers`,
        description: handovers.subtitle,
        severity: 'warn',
        icon: 'pi pi-key',
        actionLabel: 'Review',
        href: '/builder-portal/handovers',
      });
    }

    if (snags) {
      items.push({
        id: 'open-snags',
        title: `${snags.value} open snags`,
        description: snags.subtitle,
        severity: 'error',
        icon: 'pi pi-exclamation-triangle',
        actionLabel: 'View projects',
        href: '/builder-portal/projects',
      });
    }

    if (owners?.subtitle.includes('pending')) {
      items.push({
        id: 'owner-invites',
        title: 'Owner invitations waiting',
        description: owners.subtitle,
        severity: 'info',
        icon: 'pi pi-users',
        actionLabel: 'Manage owners',
        href: '/builder-portal/owners',
      });
    }

    if (stats.byStatus.planning + stats.byStatus.upcoming > 0) {
      items.push({
        id: 'pre-construction',
        title: `${stats.byStatus.planning + stats.byStatus.upcoming} projects in pre-construction`,
        description: 'Keep planning and upcoming sites moving toward construction.',
        severity: 'info',
        icon: 'pi pi-briefcase',
        actionLabel: 'Open projects',
        href: '/builder-portal/projects',
      });
    }

    return items;
  });

  /** One-line Settings link — account facts no longer occupy dashboard zones. */
  readonly accountHealth = computed((): EnterpriseDashboardAccountHealth => {
    const completion = this.branding.completion();
    const incomplete = completion.completionPercent < 100;
    return {
      label: 'Account health',
      detail: incomplete
        ? `Branding ${completion.completionPercent}% complete — review branding, communications, and subscription in Settings.`
        : 'Branding, communications, and subscription live in Settings.',
      href: '/builder-portal/settings',
      tone: incomplete ? 'attention' : 'ok',
    };
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

  isLoading(id: BuilderDashboardWidgetId): boolean {
    return this.widgetLoader.isLoading(id);
  }

  onFilterChange(value: string): void {
    this.selectedFilter.set(value);
  }

  async onRefreshAll(): Promise<void> {
    this.refreshingAll.set(true);
    const ids: BuilderDashboardWidgetId[] = [
      'recent-activity',
      'recent-projects',
      'project-status-overview',
      'project-progress',
    ];
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

  onAttentionAction(id: string): void {
    const item = this.attentionItems().find((entry) => entry.id === id);
    if (item?.href) {
      void this.router.navigateByUrl(item.href);
    }
  }
}
