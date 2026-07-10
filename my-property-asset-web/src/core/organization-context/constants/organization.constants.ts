export const ORGANIZATION_EVENT_TYPES = {
  contextResolved: 'organization.contextResolved',
  contextChanged: 'organization.contextChanged',
  contextCleared: 'organization.contextCleared',
  switched: 'organization.switched',
  switchFailed: 'organization.switchFailed',
} as const;

export const ORGANIZATION_STORAGE_KEYS = {
  activeOrganization: 'mpa-active-organization',
  lastUsedOrganization: 'mpa-last-used-organization',
} as const;

export const ORGANIZATION_QUERY_PARAMS = {
  organizationId: 'organizationId',
} as const;
