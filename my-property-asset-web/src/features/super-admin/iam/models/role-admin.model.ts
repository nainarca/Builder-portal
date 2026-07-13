import { PermissionLevel, PlatformRole, ResourceId } from '@core/rbac/models/permission.model';

export interface RoleAdminRecord {
  readonly id: PlatformRole;
  readonly label: string;
  readonly scope: 'platform' | 'organization';
  readonly description: string;
  readonly isSystem: boolean;
  readonly userCount: number;
  readonly permissionCount: number;
  readonly portals: readonly string[];
}

export interface RoleAssignmentRecord {
  readonly id: string;
  readonly roleId: PlatformRole;
  readonly userId: string;
  readonly userName: string;
  readonly userEmail: string;
  readonly organizationId?: string;
  readonly organizationName?: string;
  readonly assignedAt: string;
  readonly assignedBy: string;
}

export interface RolePermissionEntry {
  readonly resource: ResourceId;
  readonly resourceLabel: string;
  readonly category: string;
  readonly level: PermissionLevel;
}

export interface RoleTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface RoleListQuery {
  readonly search: string;
  readonly scopeFilter: 'all' | 'platform' | 'organization';
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface RoleListResult {
  readonly items: readonly RoleAdminRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
