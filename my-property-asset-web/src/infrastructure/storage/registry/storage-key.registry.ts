export const STORAGE_KEYS = {
  userPreferences: 'mpa-user-preferences',
  appPreferences: 'mpa-app-preferences',
  configCache: 'mpa-app-config-cache',
  featureFlagOverrides: 'mpa-feature-flag-overrides',
  lastUsedOrganization: 'mpa-last-used-organization',
  activeOrganization: 'mpa-active-organization',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
