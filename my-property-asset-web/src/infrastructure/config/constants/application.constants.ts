export const APPLICATION_CONSTANTS = {
  appName: 'MyPropertyAsset',
  appShortName: 'MPA',
  defaultLocale: 'en-US',
  defaultTimezone: 'UTC',
  defaultCurrency: 'USD',
  defaultDateFormat: 'medium',
  defaultTimeFormat: 'short',
  configCacheTtlMs: 5 * 60 * 1000,
  runtimeConfigAssetPath: '/assets/config/runtime-config.json',
} as const;

export const APPLICATION_TOKENS = {
  configCacheKey: 'mpa-app-config-cache',
  preferencesKey: 'mpa-user-preferences',
  appPreferencesKey: 'mpa-app-preferences',
} as const;
