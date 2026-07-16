export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AuditCategory =
  | 'auth'
  | 'organization'
  | 'builder'
  | 'billing'
  | 'settings'
  | 'security'
  | 'system'
  | 'user';
export type OpsSectionId =
  | 'dashboard'
  | 'health'
  | 'audit'
  | 'activity'
  | 'monitoring'
  | 'alerts'
  | 'communications';

export type TelemetryProviderId =
  | 'sentry'
  | 'app-insights'
  | 'ga'
  | 'grafana'
  | 'datadog'
  | 'otel'
  | 'prometheus'
  | 'cloudwatch';

export interface OpsNavItem {
  readonly id: OpsSectionId;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
}

export interface HealthServiceRecord {
  readonly id: string;
  readonly name: string;
  readonly category: 'application' | 'database' | 'auth' | 'storage' | 'api' | 'worker';
  readonly status: HealthStatus;
  readonly latencyMs: number;
  readonly uptimePercent: number;
  readonly lastCheckedAt: string;
  readonly message: string;
}

export interface HealthScoreSnapshot {
  readonly score: number;
  readonly status: HealthStatus;
  readonly healthyCount: number;
  readonly degradedCount: number;
  readonly downCount: number;
  readonly updatedAt: string;
}

export interface AuditLogRecord {
  readonly id: string;
  readonly timestamp: string;
  readonly actorName: string;
  readonly actorEmail: string;
  readonly action: string;
  readonly category: AuditCategory;
  readonly resource: string;
  readonly organizationName?: string;
  readonly builderName?: string;
  readonly ipAddress: string;
  readonly outcome: 'success' | 'failure' | 'denied';
  readonly summary: string;
  readonly metadata?: Record<string, string>;
}

export interface OpsUserActivityRecord {
  readonly id: string;
  readonly timestamp: string;
  readonly userName: string;
  readonly email: string;
  readonly type: 'login' | 'failed_login' | 'session' | 'security' | 'org' | 'builder';
  readonly detail: string;
  readonly organizationName?: string;
  readonly location?: string;
}

export interface MetricPoint {
  readonly label: string;
  readonly value: number;
}

export interface MonitoringMetric {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly unit: string;
  readonly trend: 'up' | 'down' | 'flat';
  readonly deltaPercent: number;
  readonly series: readonly MetricPoint[];
}

export interface OpsAlertRecord {
  readonly id: string;
  readonly severity: AlertSeverity;
  readonly title: string;
  readonly message: string;
  readonly source: string;
  readonly createdAt: string;
  readonly acknowledged: boolean;
  readonly acknowledgedAt?: string;
  readonly organizationName?: string;
}

export interface IncidentRecord {
  readonly id: string;
  readonly title: string;
  readonly severity: AlertSeverity;
  readonly status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly summary: string;
}

export interface TimelineEvent {
  readonly id: string;
  readonly timestamp: string;
  readonly title: string;
  readonly description: string;
  readonly kind: 'health' | 'audit' | 'alert' | 'incident' | 'maintenance';
  readonly severity?: AlertSeverity;
}

export interface QueueJobStatus {
  readonly id: string;
  readonly name: string;
  readonly pending: number;
  readonly processing: number;
  readonly failed: number;
  readonly status: HealthStatus;
}

export interface TelemetryProviderPlaceholder {
  readonly id: TelemetryProviderId;
  readonly name: string;
  readonly description: string;
  readonly status: 'planned' | 'coming_soon' | 'enterprise_only';
  readonly icon: string;
}

export interface OpsOverview {
  readonly healthScore: number;
  readonly healthStatus: HealthStatus;
  readonly activeAlerts: number;
  readonly criticalAlerts: number;
  readonly auditEventsToday: number;
  readonly failedLoginsToday: number;
  readonly avgResponseMs: number;
  readonly errorRatePercent: number;
}
