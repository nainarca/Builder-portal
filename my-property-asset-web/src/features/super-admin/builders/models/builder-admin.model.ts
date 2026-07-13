import { PlatformRole } from '@core/rbac/models/permission.model';

export type BuilderAdminStatus = 'active' | 'pending' | 'inactive' | 'archived';

export interface BuilderBusinessAddress {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
}

export interface BuilderAdminRecord {
  readonly id: string;
  readonly companyName: string;
  readonly tradingName?: string;
  readonly status: BuilderAdminStatus;
  readonly logoUrl?: string;
  readonly primaryColor?: string;
  readonly secondaryColor?: string;
  readonly registrationNumber?: string;
  readonly registeredAt?: string;
  readonly primaryContactName: string;
  readonly primaryContactEmail: string;
  readonly primaryContactPhone?: string;
  readonly address: BuilderBusinessAddress;
  readonly organizationId?: string;
  readonly organizationName?: string;
  readonly region?: string;
  readonly plan?: string;
  readonly projectCount: number;
  readonly unitCount: number;
  readonly ownerCount: number;
  readonly contactCount: number;
  readonly documentCount: number;
  readonly invitationCount: number;
  readonly whiteLabelEnabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface BuilderContactRecord {
  readonly id: string;
  readonly builderId: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly role: PlatformRole | string;
  readonly isPrimary?: boolean;
  readonly status: 'active' | 'invited' | 'suspended';
  readonly invitedAt?: string;
}

export interface BuilderActivityRecord {
  readonly id: string;
  readonly builderId: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly type: 'status' | 'contact' | 'branding' | 'registration' | 'system';
}

export interface BuilderStatusHistoryRecord {
  readonly id: string;
  readonly builderId: string;
  readonly status: BuilderAdminStatus;
  readonly changedAt: string;
  readonly changedBy: string;
  readonly reason?: string;
}

export interface BuilderAuditRecord {
  readonly id: string;
  readonly builderId: string;
  readonly action: string;
  readonly actor: string;
  readonly timestamp: string;
  readonly detail: string;
}

export interface BuilderFormModel {
  companyName: string;
  tradingName: string;
  status: BuilderAdminStatus;
  registrationNumber: string;
  registeredAt: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  organizationId: string;
  region: string;
  plan: string;
  primaryColor: string;
  secondaryColor: string;
  whiteLabelEnabled: boolean;
}

export interface BuilderTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface BuilderSavedView {
  readonly id: string;
  readonly name: string;
  readonly statusFilter: BuilderAdminStatus | 'all';
  readonly regionFilter: string;
  readonly isDefault?: boolean;
}

export interface BuilderListQuery {
  readonly search: string;
  readonly statusFilter: BuilderAdminStatus | 'all';
  readonly regionFilter: string;
  readonly planFilter: string;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface BuilderListResult {
  readonly items: readonly BuilderAdminRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type BuilderBulkAction = 'activate' | 'deactivate' | 'archive' | 'export';
