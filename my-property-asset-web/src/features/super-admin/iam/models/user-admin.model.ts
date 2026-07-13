import { PermissionLevel, PlatformRole } from '@core/rbac/models/permission.model';

export type UserAdminStatus = 'active' | 'pending' | 'inactive' | 'suspended' | 'archived';

export interface UserMembershipRecord {
  readonly organizationId: string;
  readonly organizationName: string;
  readonly organizationType: 'builder' | 'owner' | 'platform';
  readonly role: PlatformRole;
  readonly isPrimary?: boolean;
}

export interface UserAdminRecord {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatarUrl?: string;
  readonly status: UserAdminStatus;
  readonly primaryRole: PlatformRole;
  readonly memberships: readonly UserMembershipRecord[];
  readonly organizationId?: string;
  readonly organizationName?: string;
  readonly builderId?: string;
  readonly builderName?: string;
  readonly lastLoginAt?: string;
  readonly lastActiveAt?: string;
  readonly mfaEnabled: boolean;
  readonly emailVerified: boolean;
  readonly sessionCount: number;
  readonly permissionCount: number;
  readonly invitationStatus: 'none' | 'pending' | 'accepted' | 'expired';
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserActivityRecord {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly type: 'login' | 'role' | 'permission' | 'invitation' | 'security' | 'system';
}

export interface UserStatusHistoryRecord {
  readonly id: string;
  readonly userId: string;
  readonly status: UserAdminStatus;
  readonly changedAt: string;
  readonly changedBy: string;
  readonly reason?: string;
}

export interface UserAuditRecord {
  readonly id: string;
  readonly userId: string;
  readonly action: string;
  readonly actor: string;
  readonly timestamp: string;
  readonly detail: string;
}

export interface UserSecuritySummary {
  readonly mfaEnabled: boolean;
  readonly emailVerified: boolean;
  readonly lastLoginAt?: string;
  readonly lastActiveAt?: string;
  readonly sessionCount: number;
  readonly activeSessions: number;
  readonly failedLoginAttempts: number;
  readonly passwordChangedAt?: string;
}

export interface UserFormModel {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  status: UserAdminStatus;
  primaryRole: PlatformRole;
  organizationId: string;
  builderId: string;
  mfaEnabled: boolean;
}

export interface UserTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface UserSavedView {
  readonly id: string;
  readonly name: string;
  readonly statusFilter: UserAdminStatus | 'all';
  readonly roleFilter: PlatformRole | 'all';
  readonly isDefault?: boolean;
}

export interface UserListQuery {
  readonly search: string;
  readonly statusFilter: UserAdminStatus | 'all';
  readonly roleFilter: PlatformRole | 'all';
  readonly organizationFilter: string;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface UserListResult {
  readonly items: readonly UserAdminRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type UserBulkAction = 'activate' | 'deactivate' | 'suspend' | 'archive' | 'export';

export interface UserPermissionSummaryItem {
  readonly resource: string;
  readonly label: string;
  readonly level: PermissionLevel;
  readonly category: string;
}
