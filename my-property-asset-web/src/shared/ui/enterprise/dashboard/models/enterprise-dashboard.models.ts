import type {
  EnterpriseHealthLevel,
  EnterpriseMetricData,
  EnterpriseTimelineEvent,
  EnterpriseTrendDirection,
} from '../../models/enterprise.models';

export type EnterpriseDashboardLayoutMode = 'dashboard' | 'analytics';
export type EnterpriseDashboardLifecycleState =
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'error'
  | 'no-data'
  | 'permission-denied'
  | 'maintenance';

export type EnterpriseChartType =
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'stacked-bar'
  | 'timeline'
  | 'sparkline';

export type EnterpriseDashboardWidgetSize = 1 | 2 | 3 | 4;

export interface EnterpriseChartSeries {
  readonly label: string;
  readonly values: readonly number[];
  readonly color?: string;
}

export interface EnterpriseChartConfig {
  readonly id: string;
  readonly type: EnterpriseChartType;
  readonly title: string;
  readonly subtitle?: string;
  readonly labels: readonly string[];
  readonly series: readonly EnterpriseChartSeries[];
  readonly emptyMessage?: string;
}

export interface EnterpriseDashboardWidgetDefinition {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly icon?: string;
  readonly colspan?: EnterpriseDashboardWidgetSize;
  readonly rowspan?: 1 | 2;
  readonly refreshable?: boolean;
  readonly collapsible?: boolean;
  readonly order?: number;
}

export interface EnterpriseDashboardGridItemConfig {
  readonly colspan?: EnterpriseDashboardWidgetSize;
  readonly rowspan?: 1 | 2;
  readonly priority?: 'always' | 'desktop' | 'laptop' | 'tablet' | 'mobile';
}

export interface EnterpriseDashboardFilterOption {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface EnterpriseDashboardQuickAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly description?: string;
  readonly pinned?: boolean;
  readonly disabled?: boolean;
}

export interface EnterpriseDashboardActivityItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly timestamp: string;
  readonly absoluteTimestamp?: string;
  readonly icon?: string;
}

export interface EnterpriseDashboardNotificationItem {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly timestamp: string;
  readonly read?: boolean;
  readonly severity?: 'info' | 'success' | 'warn' | 'error';
}

export interface EnterpriseDashboardTaskItem {
  readonly id: string;
  readonly title: string;
  readonly dueLabel?: string;
  readonly completed?: boolean;
  readonly priority?: 'low' | 'medium' | 'high';
}

export interface EnterpriseDashboardApprovalItem {
  readonly id: string;
  readonly title: string;
  readonly requester: string;
  readonly submittedAt: string;
}

export interface EnterpriseDashboardEventItem {
  readonly id: string;
  readonly title: string;
  readonly startLabel: string;
  readonly location?: string;
}

export interface EnterpriseDashboardInsight {
  readonly id: string;
  readonly kind: 'alert' | 'recommendation' | 'warning' | 'information' | 'success';
  readonly title: string;
  readonly message: string;
  readonly actionLabel?: string;
}

export interface EnterpriseKpiComparisonData extends EnterpriseMetricData {
  readonly comparisonValue?: string;
  readonly comparisonLabel?: string;
}

export interface EnterpriseKpiGrowthData extends EnterpriseMetricData {
  readonly growthRate?: string;
  readonly periodLabel?: string;
}

export interface EnterpriseKpiFinancialData extends EnterpriseMetricData {
  readonly currency?: string;
}

export interface EnterpriseKpiOccupancyData extends EnterpriseMetricData {
  readonly occupied?: number;
  readonly total?: number;
}

export interface EnterpriseKpiProgressData {
  readonly label: string;
  readonly value: number;
  readonly detail?: string;
}

export interface EnterpriseKpiStatusData {
  readonly label: string;
  readonly statusLabel: string;
  readonly level: EnterpriseHealthLevel;
}

export type { EnterpriseTrendDirection, EnterpriseTimelineEvent };
