export const RBAC_EVENT_TYPES = {
  permissionChanged: 'rbac.permissionChanged',
  roleChanged: 'rbac.roleChanged',
  contextChanged: 'rbac.contextChanged',
  authorizationFailed: 'rbac.authorizationFailed',
  authorizationGranted: 'rbac.authorizationGranted',
} as const;

export const RBAC_QUERY_PARAMS = {
  deniedReason: 'deniedReason',
} as const;

export const PORTAL_PERMISSION_KEYS = {
  superAdmin: 'portal:super-admin',
  builderPortal: 'portal:builder-portal',
  ownerWeb: 'portal:owner-web',
  tenantPortal: 'portal:tenant-portal',
} as const;

export const PERMISSION_LEVEL_RANK: Record<string, number> = {
  none: 0,
  'own-read': 1,
  read: 2,
  delegated: 2,
  contribute: 3,
  decide: 3,
  operate: 4,
  full: 5,
};
