export type CommunicationType =
  | 'construction-progress-update'
  | 'project-completion-update'
  | 'new-project-launch'
  | 'new-project-promotion'
  | 'festival-greetings'
  | 'maintenance-notice'
  | 'emergency-notice'
  | 'general-announcement'
  | 'offer-promotion'
  | 'payment-reminder'
  | 'subscription-reminder'
  | 'document-reminder'
  | 'welcome-message'
  | 'custom-message';

export type CommunicationPriority = 'low' | 'normal' | 'high' | 'critical';

export type CommunicationStatus =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'expired'
  | 'archived'
  | 'cancelled';

export type CommunicationDeliveryStatus = 'prepared' | 'queued' | 'delivered' | 'failed';

export type CommunicationAudienceType =
  | 'all_owners'
  | 'by_project'
  | 'by_building'
  | 'by_unit'
  | 'selected_owners'
  | 'by_property_type';

export interface CommunicationAudienceConfig {
  projectId?: string;
  buildingId?: string;
  unitIds?: readonly string[];
  ownerIds?: readonly string[];
  propertyType?: string;
}

export interface CommunicationCta {
  label?: string;
  externalUrl?: string;
  internalRoute?: string;
}

export interface BuilderCommunication {
  readonly id: string;
  readonly organizationId: string;
  readonly communicationType: CommunicationType;
  readonly title: string;
  readonly shortDescription: string;
  readonly detailedContent: string;
  readonly bannerImageUrl?: string;
  readonly attachmentUrl?: string;
  readonly cta: CommunicationCta;
  readonly priority: CommunicationPriority;
  readonly audienceType: CommunicationAudienceType;
  readonly audienceConfig: CommunicationAudienceConfig;
  readonly status: CommunicationStatus;
  readonly publishAt?: string;
  readonly startAt?: string;
  readonly expiresAt?: string;
  readonly recipientCount: number;
  readonly deliveryStatus: CommunicationDeliveryStatus;
  readonly moderated: boolean;
  readonly disabledByPlatform: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt?: string;
  readonly archivedAt?: string;
  readonly cancelledAt?: string;
  readonly createdBy: string;
  readonly updatedBy?: string;
  readonly publishedBy?: string;
}

export interface CommunicationFormModel {
  communicationType: CommunicationType;
  title: string;
  shortDescription: string;
  detailedContent: string;
  bannerImageUrl: string;
  attachmentUrl: string;
  ctaLabel: string;
  ctaExternalUrl: string;
  ctaInternalRoute: string;
  priority: CommunicationPriority;
  audienceType: CommunicationAudienceType;
  audienceConfig: CommunicationAudienceConfig;
  publishAt: string;
  startAt: string;
  expiresAt: string;
}

export interface CommunicationListQuery {
  readonly search: string;
  readonly communicationType: CommunicationType | 'all';
  readonly status: CommunicationStatus | 'all';
  readonly priority: CommunicationPriority | 'all';
  readonly projectId: string;
  readonly publishDateFrom: string;
  readonly publishDateTo: string;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface CommunicationListResult {
  readonly items: readonly BuilderCommunication[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface CommunicationAuditEvent {
  readonly id: string;
  readonly campaignId: string;
  readonly organizationId: string;
  readonly action:
    | 'created'
    | 'updated'
    | 'published'
    | 'scheduled'
    | 'archived'
    | 'cancelled'
    | 'deleted'
    | 'moderated'
    | 'disabled';
  readonly actorLabel: string;
  readonly detail?: string;
  readonly createdAt: string;
}

export interface CommunicationDashboardSummary {
  readonly draftCount: number;
  readonly publishedCount: number;
  readonly scheduledCount: number;
  readonly expiredCount: number;
  readonly totalRecipients: number;
  readonly deliveryPreparedCount: number;
}

export interface OwnerNotificationContract {
  readonly id: string;
  readonly campaignId: string;
  readonly organizationId: string;
  readonly communicationType: CommunicationType;
  readonly title: string;
  readonly shortDescription: string;
  readonly detailedContent: string;
  readonly bannerImageUrl?: string;
  readonly attachmentUrl?: string;
  readonly priority: CommunicationPriority;
  readonly cta?: CommunicationCta;
  readonly publishedAt: string;
  readonly expiresAt?: string;
  readonly read: boolean;
  readonly bookmarked: boolean;
  readonly archived: boolean;
}

export interface OwnerPushNotificationContract {
  readonly notificationId: string;
  readonly campaignId: string;
  readonly title: string;
  readonly body: string;
  readonly priority: CommunicationPriority;
  readonly imageUrl?: string;
  readonly deepLink?: string;
  readonly publishedAt: string;
}
