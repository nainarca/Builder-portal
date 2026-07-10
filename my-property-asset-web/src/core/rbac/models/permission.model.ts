export type PermissionLevel =
  | 'none'
  | 'own-read'
  | 'read'
  | 'contribute'
  | 'operate'
  | 'decide'
  | 'full'
  | 'delegated';

export type PlatformRole =
  | 'public-visitor'
  | 'super-admin'
  | 'builder-org-owner'
  | 'builder-org-admin'
  | 'builder-org-member'
  | 'owner-org-owner'
  | 'owner-web-user'
  | 'tenant-portal-user'
  | 'support-user';

export type PortalType =
  | 'super-admin'
  | 'builder-portal'
  | 'owner-web'
  | 'tenant-portal'
  | 'public-website';

export type ResourceId =
  | 'id-01-marketing-leads'
  | 'id-02-builder-onboarding'
  | 'id-03-organization-tenancy'
  | 'id-04-white-label-branding'
  | 'id-05-subscription-commercial'
  | 'id-06-platform-operations'
  | 'id-07-project-unit'
  | 'id-08-owner-assignment-prospect'
  | 'id-09-handover-document'
  | 'id-10-invitation'
  | 'id-11-notification'
  | 'id-12-reporting-analytics'
  | 'id-13-owner-financial-property'
  | 'id-14-user-identity-access'
  | 'id-15-future-tenant'
  | 'portal';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'configure'
  | 'approve'
  | 'invite'
  | 'export';

export interface PermissionRequirement {
  resource: ResourceId | string;
  level: PermissionLevel;
}

export interface PolicyRule {
  id: string;
  resource: ResourceId | string;
  level: PermissionLevel;
  roles: readonly PlatformRole[];
  portals?: readonly PortalType[];
  description?: string;
}

export interface AuthorizationResult {
  granted: boolean;
  reason?: 'authenticated' | 'role' | 'permission' | 'portal' | 'organization' | 'feature' | 'denied';
  message?: string;
}

export type PermissionSet = Readonly<Record<string, PermissionLevel>>;

export interface UserContext {
  userId: string | null;
  email: string | null;
  role: PlatformRole;
  portals: readonly string[];
  supportAccessOrganizationId?: string | null;
}

export interface AuthorizationState {
  initialized: boolean;
  loading: boolean;
  role: PlatformRole | null;
  permissions: PermissionSet;
  lastResolvedAt: number | null;
  error: string | null;
}
