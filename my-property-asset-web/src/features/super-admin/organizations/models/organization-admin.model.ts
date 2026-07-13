import { OrganizationType } from '@core/organization-context/models/organization.model';
import { PlatformRole } from '@core/rbac/models/permission.model';

export type OrganizationAdminStatus = 'active' | 'inactive' | 'archived' | 'pending';

export interface OrganizationAdminRecord {
  readonly id: string;
  readonly name: string;
  readonly shortName?: string;
  readonly type: OrganizationType;
  readonly status: OrganizationAdminStatus;
  readonly logoUrl?: string;
  readonly primaryColor?: string;
  readonly contactName?: string;
  readonly contactEmail?: string;
  readonly region?: string;
  readonly plan?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly memberCount: number;
  readonly projectCount: number;
  readonly subscriptionTier: string;
  readonly subscriptionStatus: 'active' | 'trial' | 'expired' | 'none';
  readonly whiteLabelEnabled: boolean;
  readonly supportAccessEnabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OrganizationMemberRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly email: string;
  readonly role: PlatformRole;
  readonly status: 'active' | 'invited' | 'suspended';
  readonly invitedAt?: string;
  readonly joinedAt?: string;
}

export interface OrganizationActivityRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly type: 'status' | 'member' | 'branding' | 'system';
}

export interface OrganizationStatusHistoryRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly status: OrganizationAdminStatus;
  readonly changedAt: string;
  readonly changedBy: string;
  readonly reason?: string;
}

export interface OrganizationAuditRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly action: string;
  readonly actor: string;
  readonly timestamp: string;
  readonly detail: string;
}

export interface OrganizationFormModel {
  name: string;
  shortName: string;
  type: OrganizationType;
  status: OrganizationAdminStatus;
  contactName: string;
  contactEmail: string;
  region: string;
  plan: string;
  slug: string;
  description: string;
  primaryColor: string;
  whiteLabelEnabled: boolean;
  supportAccessEnabled: boolean;
}

export interface OrganizationTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface OrganizationSavedView {
  readonly id: string;
  readonly name: string;
  readonly statusFilter: OrganizationAdminStatus | 'all';
  readonly typeFilter: OrganizationType | 'all';
  readonly isDefault?: boolean;
}

export interface OrganizationListQuery {
  readonly search: string;
  readonly statusFilter: OrganizationAdminStatus | 'all';
  readonly typeFilter: OrganizationType | 'all';
  readonly regionFilter: string;
  readonly planFilter: string;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface OrganizationListResult {
  readonly items: readonly OrganizationAdminRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type OrganizationBulkAction = 'activate' | 'deactivate' | 'archive' | 'export';
