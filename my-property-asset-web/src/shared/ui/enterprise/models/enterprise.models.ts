/** DS-03 Enterprise Component Library — shared presentation models (no business logic). */

export type EnterpriseButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'success'
  | 'ghost'
  | 'text'
  | 'icon';

export type EnterpriseTrendDirection = 'up' | 'down' | 'neutral';

export interface EnterpriseMetricData {
  label: string;
  value: string;
  trend?: EnterpriseTrendDirection;
  trendLabel?: string;
  hint?: string;
}

export interface EnterpriseTimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  absoluteTimestamp?: string;
  icon?: string;
}

export interface EnterpriseStatusFact {
  label: string;
  value: string;
}

export interface EnterpriseAvatarData {
  name: string;
  imageUrl?: string | null;
  initials?: string;
}

export type EnterpriseHealthLevel = 'healthy' | 'warning' | 'critical' | 'unknown' | 'offline';

export type EnterpriseAlertSeverity = 'success' | 'warning' | 'information' | 'error';

export type EnterpriseAvatarKind =
  | 'user'
  | 'builder'
  | 'organization'
  | 'project'
  | 'group';
