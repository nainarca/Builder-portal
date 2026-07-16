export type AuditCategory =
  | 'builder_login'
  | 'subscription'
  | 'branding'
  | 'project'
  | 'handover'
  | 'permission'
  | 'system'
  | 'communication'
  | 'support'
  | 'settings';

export type SupportTicketStatus =
  | 'open'
  | 'in_progress'
  | 'waiting_builder'
  | 'resolved'
  | 'closed';

export type SupportTicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface PlatformAuditEvent {
  readonly id: string;
  readonly organizationId?: string;
  readonly actorLabel: string;
  readonly category: AuditCategory;
  readonly action: string;
  readonly entityType?: string;
  readonly entityId?: string;
  readonly summary: string;
  readonly detail?: Record<string, unknown>;
  readonly createdAt: string;
}

export interface SupportTicket {
  readonly id: string;
  readonly organizationId?: string;
  readonly builderCompanyName: string;
  readonly subject: string;
  readonly description: string;
  readonly status: SupportTicketStatus;
  readonly priority: SupportTicketPriority;
  readonly contactEmail?: string;
  readonly assignedTo?: string;
  readonly internalNotes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly resolvedAt?: string;
}

export interface SupportTicketDraft {
  organizationId?: string;
  builderCompanyName: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  contactEmail?: string;
}

export interface PlatformMetricsSnapshot {
  readonly totalBuilders: number;
  readonly activeBuilders: number;
  readonly trialBuilders: number;
  readonly expiredBuilders: number;
  readonly suspendedBuilders: number;
  readonly totalProjects: number;
  readonly totalUnits: number;
  readonly totalActiveOwners: number;
  readonly totalDigitalHandovers: number;
  readonly storageUsageGb: number;
  readonly monthlyGrowthPercent: number;
  readonly platformHealth: 'healthy' | 'degraded' | 'critical';
  readonly openSupportTickets: number;
  readonly activeSubscriptions: number;
}

export interface AnalyticsSeriesPoint {
  readonly label: string;
  readonly value: number;
}

export interface PlatformAnalyticsModel {
  readonly builderGrowth: readonly AnalyticsSeriesPoint[];
  readonly subscriptionRevenuePlaceholder: readonly AnalyticsSeriesPoint[];
  readonly projectGrowth: readonly AnalyticsSeriesPoint[];
  readonly ownerGrowth: readonly AnalyticsSeriesPoint[];
  readonly handoverTrends: readonly AnalyticsSeriesPoint[];
  readonly storageUsageGb: number;
  readonly communicationActivity: number;
  readonly systemUsageScore: number;
}

export interface BuilderSearchFilter {
  search: string;
  status: 'all' | 'active' | 'pending' | 'inactive' | 'archived';
  plan: string;
  dateFrom: string;
  dateTo: string;
  minProjects: number | null;
  minUnits: number | null;
}

export interface BrandingOversightItem {
  readonly organizationId: string;
  readonly builderName: string;
  readonly enabled: boolean;
  readonly completionPercent: number;
  readonly statusLabel: string;
  readonly lastUpdatedAt: string;
}
