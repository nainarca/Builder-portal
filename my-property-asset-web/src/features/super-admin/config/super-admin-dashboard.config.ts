import {
  DashboardActivityItem,
  DashboardAnnouncementItem,
  DashboardChartConfig,
  DashboardFilterOption,
  DashboardKpiItem,
  DashboardQuickActionItem,
  DashboardStatusItem,
  DashboardSummaryItem,
  DashboardTrendItem,
  DashboardWidgetDefinition,
} from '../models/dashboard.model';

export const SUPER_ADMIN_DASHBOARD_HEADER = {
  eyebrow: 'Super Admin',
  title: 'Platform dashboard',
  description:
    'Executive overview of platform health, adoption, and operational signals across MyPropertyAsset.',
};

export const SUPER_ADMIN_DASHBOARD_KPIS: readonly DashboardKpiItem[] = [
  {
    id: 'orgs',
    label: 'Organizations',
    value: '128',
    hint: 'Active tenants',
    icon: 'pi pi-sitemap',
    tone: 'primary',
    trend: 'up',
    trendLabel: '+12% vs last month',
  },
  {
    id: 'builders',
    label: 'Builders',
    value: '54',
    hint: 'Onboarded partners',
    icon: 'pi pi-building',
    tone: 'info',
    trend: 'up',
    trendLabel: '+6 this quarter',
  },
  {
    id: 'users',
    label: 'Platform users',
    value: '2,418',
    hint: 'Across all portals',
    icon: 'pi pi-users',
    tone: 'success',
    trend: 'up',
    trendLabel: '+8.4% weekly',
  },
  {
    id: 'uptime',
    label: 'Uptime',
    value: '99.97%',
    hint: '30-day rolling',
    icon: 'pi pi-server',
    tone: 'success',
    trend: 'neutral',
    trendLabel: 'Within SLA',
  },
];

export const SUPER_ADMIN_DASHBOARD_TRENDS: readonly DashboardTrendItem[] = [
  {
    id: 'sessions',
    label: 'Active sessions',
    value: '342',
    change: '+18%',
    trend: 'up',
    period: 'Last 24 hours',
  },
  {
    id: 'signups',
    label: 'New sign-ins',
    value: '47',
    change: '+5%',
    trend: 'up',
    period: 'Last 7 days',
  },
  {
    id: 'support',
    label: 'Support tickets',
    value: '12',
    change: '-22%',
    trend: 'down',
    period: 'Open queue',
  },
];

export const SUPER_ADMIN_DASHBOARD_STATUSES: readonly DashboardStatusItem[] = [
  {
    id: 'api',
    label: 'API gateway',
    status: 'healthy',
    detail: 'Latency 42ms p95',
    icon: 'pi pi-bolt',
  },
  {
    id: 'auth',
    label: 'Authentication',
    status: 'healthy',
    detail: 'Session services nominal',
    icon: 'pi pi-lock',
  },
  {
    id: 'db',
    label: 'Data services',
    status: 'degraded',
    detail: 'Elevated read latency',
    icon: 'pi pi-database',
  },
  {
    id: 'jobs',
    label: 'Background jobs',
    status: 'healthy',
    detail: 'Queue depth normal',
    icon: 'pi pi-cog',
  },
];

export const SUPER_ADMIN_DASHBOARD_SUMMARIES: readonly DashboardSummaryItem[] = [
  {
    id: 'org-summary',
    title: 'Organizations',
    value: '128',
    subtitle: '3 pending onboarding reviews',
    icon: 'pi pi-sitemap',
  },
  {
    id: 'builder-summary',
    title: 'Builders',
    value: '54',
    subtitle: '7 in pilot programs',
    icon: 'pi pi-building',
  },
  {
    id: 'user-summary',
    title: 'Users',
    value: '2,418',
    subtitle: '186 admins across tenants',
    icon: 'pi pi-users',
  },
];

export const SUPER_ADMIN_DASHBOARD_ACTIVITIES: readonly DashboardActivityItem[] = [
  {
    id: 'a1',
    title: 'Builder onboarding approved',
    description: 'Apex Developments moved to active status.',
    timestamp: '12 minutes ago',
    icon: 'pi pi-check-circle',
    tone: 'success',
  },
  {
    id: 'a2',
    title: 'Organization context switched',
    description: 'Support user accessed Horizon Estates tenant.',
    timestamp: '34 minutes ago',
    icon: 'pi pi-sync',
    tone: 'info',
  },
  {
    id: 'a3',
    title: 'Platform maintenance window scheduled',
    description: 'Planned upgrade for authentication services.',
    timestamp: '2 hours ago',
    icon: 'pi pi-calendar',
    tone: 'warning',
  },
  {
    id: 'a4',
    title: 'New organization created',
    description: 'Summit Property Group entered evaluation.',
    timestamp: '5 hours ago',
    icon: 'pi pi-plus-circle',
    tone: 'primary',
  },
];

export const SUPER_ADMIN_DASHBOARD_ANNOUNCEMENTS: readonly DashboardAnnouncementItem[] = [
  {
    id: 'n1',
    title: 'ADMIN-002 modules incoming',
    message: 'Organization and builder management modules will extend this dashboard foundation.',
    date: 'Jul 10, 2026',
    type: 'info',
  },
  {
    id: 'n2',
    title: 'Scheduled maintenance',
    message: 'Authentication services upgrade planned for next Sunday 02:00 UTC.',
    date: 'Jul 8, 2026',
    type: 'warning',
  },
];

export const SUPER_ADMIN_DASHBOARD_QUICK_ACTIONS: readonly DashboardQuickActionItem[] = [
  {
    id: 'qa1',
    label: 'Review builders',
    description: 'Onboarding queue and approvals',
    icon: 'pi pi-building',
    route: '/super-admin',
    permission: 'id-02-builder-onboarding:decide',
    pinned: true,
    favorite: true,
  },
  {
    id: 'qa2',
    label: 'Platform operations',
    description: 'Configuration and governance',
    icon: 'pi pi-cog',
    route: '/super-admin',
    permission: 'id-06-platform-operations:full',
    pinned: true,
  },
  {
    id: 'qa3',
    label: 'View organizations',
    description: 'Tenant overview (placeholder)',
    icon: 'pi pi-sitemap',
    route: '/super-admin/organizations',
    permission: 'id-03-organization-tenancy:read',
    favorite: true,
  },
  {
    id: 'qa4',
    label: 'System status',
    description: 'Health and incident signals',
    icon: 'pi pi-heart',
    route: '/super-admin',
  },
];

export const SUPER_ADMIN_DASHBOARD_FILTERS: readonly DashboardFilterOption[] = [
  { id: '7d', label: 'Last 7 days', value: '7d' },
  { id: '30d', label: 'Last 30 days', value: '30d' },
  { id: '90d', label: 'Last 90 days', value: '90d' },
  { id: 'ytd', label: 'Year to date', value: 'ytd' },
];

export const SUPER_ADMIN_DASHBOARD_WIDGETS: readonly DashboardWidgetDefinition[] = [
  {
    id: 'quick-actions',
    title: 'Quick actions',
    description: 'Pinned and favorite administrative actions',
    icon: 'pi pi-bolt',
    colspan: 4,
    defaultVisible: true,
    refreshable: false,
    order: 1,
  },
  {
    id: 'usage-chart',
    title: 'Usage overview',
    description: 'Platform activity trend',
    icon: 'pi pi-chart-line',
    colspan: 2,
    rowspan: 2,
    defaultVisible: true,
    refreshable: true,
    order: 2,
  },
  {
    id: 'organizations-chart',
    title: 'Organization growth',
    description: 'New tenants over time',
    icon: 'pi pi-chart-bar',
    colspan: 2,
    defaultVisible: true,
    refreshable: true,
    order: 3,
  },
  {
    id: 'platform-status',
    title: 'Platform status',
    icon: 'pi pi-server',
    colspan: 2,
    defaultVisible: true,
    refreshable: true,
    order: 4,
  },
  {
    id: 'system-health',
    title: 'System health',
    icon: 'pi pi-heart',
    colspan: 2,
    defaultVisible: true,
    refreshable: true,
    order: 5,
  },
  {
    id: 'recent-activity',
    title: 'Recent activity',
    icon: 'pi pi-history',
    colspan: 2,
    defaultVisible: true,
    refreshable: true,
    order: 6,
  },
  {
    id: 'announcements',
    title: 'Announcements',
    icon: 'pi pi-megaphone',
    colspan: 2,
    defaultVisible: true,
    refreshable: false,
    order: 7,
  },
  {
    id: 'organization-summary',
    title: 'Organization summary',
    icon: 'pi pi-sitemap',
    colspan: 1,
    defaultVisible: true,
    refreshable: true,
    order: 8,
  },
  {
    id: 'builder-summary',
    title: 'Builder summary',
    icon: 'pi pi-building',
    colspan: 1,
    defaultVisible: true,
    refreshable: true,
    order: 9,
  },
  {
    id: 'user-summary',
    title: 'User summary',
    icon: 'pi pi-users',
    colspan: 1,
    defaultVisible: true,
    refreshable: true,
    order: 10,
  },
  {
    id: 'usage-overview',
    title: 'Usage metrics',
    icon: 'pi pi-chart-pie',
    colspan: 1,
    defaultVisible: true,
    refreshable: true,
    order: 11,
  },
];

export const SUPER_ADMIN_USAGE_CHART: DashboardChartConfig = {
  id: 'usage-chart',
  type: 'area',
  title: 'Platform sessions',
  subtitle: 'Daily active sessions (framework data)',
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [{ label: 'Sessions', values: [220, 248, 260, 242, 290, 198, 210] }],
};

export const SUPER_ADMIN_ORG_CHART: DashboardChartConfig = {
  id: 'organizations-chart',
  type: 'bar',
  title: 'New organizations',
  subtitle: 'Weekly onboarding (framework data)',
  labels: ['W1', 'W2', 'W3', 'W4'],
  series: [{ label: 'Organizations', values: [4, 7, 5, 9] }],
};

export const SUPER_ADMIN_DONUT_CHART: DashboardChartConfig = {
  id: 'usage-donut',
  type: 'donut',
  title: 'Portal distribution',
  labels: ['Builder', 'Tenant', 'Partner', 'Admin'],
  series: [{ label: 'Users', values: [42, 28, 18, 12] }],
};
