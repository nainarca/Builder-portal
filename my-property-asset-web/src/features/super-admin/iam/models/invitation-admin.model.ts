import { PlatformRole } from '@core/rbac/models/permission.model';

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface InvitationAdminRecord {
  readonly id: string;
  readonly email: string;
  readonly name?: string;
  readonly role: PlatformRole;
  readonly organizationId?: string;
  readonly organizationName?: string;
  readonly builderId?: string;
  readonly builderName?: string;
  readonly invitedBy: string;
  readonly invitedByEmail: string;
  readonly status: InvitationStatus;
  readonly sentAt: string;
  readonly expiresAt: string;
  readonly acceptedAt?: string;
  readonly cancelledAt?: string;
  readonly resendCount: number;
}

export interface InvitationTimelineEvent {
  readonly id: string;
  readonly invitationId: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly type: 'sent' | 'resent' | 'accepted' | 'expired' | 'cancelled';
}

export interface InvitationFormModel {
  email: string;
  name: string;
  role: PlatformRole;
  organizationId: string;
  message: string;
}

export interface InvitationTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface InvitationListQuery {
  readonly search: string;
  readonly statusFilter: InvitationStatus | 'all';
  readonly roleFilter: PlatformRole | 'all';
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface InvitationListResult {
  readonly items: readonly InvitationAdminRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type InvitationBulkAction = 'resend' | 'cancel' | 'export';
