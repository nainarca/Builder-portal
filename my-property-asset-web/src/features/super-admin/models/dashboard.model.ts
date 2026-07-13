export type DashboardWidgetId =
  | 'recent-activity'
  | 'platform-status'
  | 'system-health'
  | 'quick-actions'
  | 'announcements'
  | 'usage-overview'
  | 'organization-summary'
  | 'builder-summary'
  | 'user-summary'
  | 'usage-chart'
  | 'organizations-chart';

export type DashboardKpiTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type DashboardStatusLevel = 'healthy' | 'degraded' | 'critical' | 'unknown';
export type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area';
export type StatTrend = 'up' | 'down' | 'neutral';

export interface DashboardKpiItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly icon: string;
  readonly tone?: DashboardKpiTone;
  readonly trend?: StatTrend;
  readonly trendLabel?: string;
}

export interface DashboardMetricItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
  readonly description?: string;
}

export interface DashboardTrendItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly trend: StatTrend;
  readonly period: string;
}

export interface DashboardStatusItem {
  readonly id: string;
  readonly label: string;
  readonly status: DashboardStatusLevel;
  readonly detail: string;
  readonly icon: string;
}

export interface DashboardSummaryItem {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly subtitle: string;
  readonly icon: string;
}

export interface DashboardActivityItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly icon: string;
  readonly tone?: DashboardKpiTone;
}

export interface DashboardAnnouncementItem {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly date: string;
  readonly type: 'info' | 'warning' | 'success';
}

export interface DashboardQuickActionItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly route?: string;
  readonly permission?: string;
  readonly pinned?: boolean;
  readonly favorite?: boolean;
}

export interface DashboardWidgetDefinition {
  readonly id: DashboardWidgetId;
  readonly title: string;
  readonly description?: string;
  readonly icon?: string;
  readonly colspan: 1 | 2 | 3 | 4;
  readonly rowspan?: 1 | 2;
  readonly defaultVisible: boolean;
  readonly refreshable: boolean;
  readonly order: number;
}

export interface DashboardChartSeries {
  readonly label: string;
  readonly values: readonly number[];
  readonly color?: string;
}

export interface DashboardChartConfig {
  readonly id: string;
  readonly type: ChartType;
  readonly title: string;
  readonly subtitle?: string;
  readonly labels: readonly string[];
  readonly series: readonly DashboardChartSeries[];
  readonly emptyMessage?: string;
}

export interface DashboardFilterOption {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface DashboardPreferences {
  readonly visibleWidgets: readonly DashboardWidgetId[];
  readonly pinnedActions: readonly string[];
  readonly favoriteActions: readonly string[];
  readonly lastRefreshedAt?: string;
}
