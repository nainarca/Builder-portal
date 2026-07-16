export type BuilderDashboardWidgetId =
  | 'recent-activity'
  | 'quick-actions'
  | 'todays-activities'
  | 'recent-projects'
  | 'project-progress'
  | 'project-status-overview'
  | 'upcoming-appointments'
  | 'notifications'
  | 'calendar'
  | 'performance-summary';

export type DashboardKpiTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area';
export type StatTrend = 'up' | 'down' | 'neutral';
export type ProjectStatus =
  | 'upcoming'
  | 'planning'
  | 'construction'
  | 'completed'
  | 'archived';

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

export interface DashboardTrendItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly trend: StatTrend;
  readonly period: string;
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
  readonly id: BuilderDashboardWidgetId;
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
  readonly visibleWidgets: readonly BuilderDashboardWidgetId[];
  readonly pinnedActions: readonly string[];
  readonly favoriteActions: readonly string[];
  readonly lastRefreshedAt?: string;
}

export interface DashboardProjectSummaryItem {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly status: ProjectStatus;
  readonly progress?: number;
  readonly projectType?: string;
  readonly unitsTotal: number;
  readonly unitsSold: number;
}
