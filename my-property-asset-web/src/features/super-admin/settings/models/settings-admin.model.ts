export type SettingsCategoryId =
  | 'general'
  | 'security'
  | 'platform'
  | 'notifications'
  | 'localization'
  | 'integrations'
  | 'preferences';

export type ConfigurationStatus = 'healthy' | 'warning' | 'error' | 'draft';
export type IntegrationStatus = 'connected' | 'disconnected' | 'planned' | 'error';

export interface SettingsNavItem {
  readonly id: SettingsCategoryId;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
}

export interface SettingsSearchItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly category: SettingsCategoryId;
  readonly route: string;
  readonly keywords: readonly string[];
}

export interface SettingsChangeRecord {
  readonly id: string;
  readonly title: string;
  readonly category: SettingsCategoryId;
  readonly changedBy: string;
  readonly changedAt: string;
}

export interface GeneralSettings {
  platformName: string;
  platformTagline: string;
  supportEmail: string;
  defaultLanguage: string;
  defaultTimezone: string;
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
}

export interface PasswordPolicySettings {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  expiryDays: number;
}

export interface SessionPolicySettings {
  idleTimeoutMinutes: number;
  absoluteTimeoutHours: number;
  rememberMeDays: number;
  singleSessionOnly: boolean;
}

export interface AuthenticationPolicySettings {
  mfaRequired: boolean;
  ssoEnabled: boolean;
  socialLoginEnabled: boolean;
  passwordlessEnabled: boolean;
}

export interface LoginRestrictionSettings {
  maxFailedAttempts: number;
  lockoutMinutes: number;
  ipAllowlistEnabled: boolean;
  geoRestrictionEnabled: boolean;
}

export interface SecuritySettings {
  passwordPolicy: PasswordPolicySettings;
  sessionPolicy: SessionPolicySettings;
  authenticationPolicy: AuthenticationPolicySettings;
  loginRestrictions: LoginRestrictionSettings;
}

export interface FeatureFlagSetting {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  enabled: boolean;
  environment: string;
}

export interface PlatformMessageSetting {
  readonly id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  active: boolean;
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  featureFlags: FeatureFlagSetting[];
  platformMessages: PlatformMessageSetting[];
  configurationStatus: ConfigurationStatus;
}

export interface NotificationChannelSettings {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export interface NotificationTemplateSetting {
  readonly id: string;
  readonly name: string;
  readonly channel: 'email' | 'in-app' | 'sms' | 'push';
  enabled: boolean;
  previewSubject: string;
}

export interface NotificationSettings {
  channels: NotificationChannelSettings;
  templates: NotificationTemplateSetting[];
  digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export interface LanguageSetting {
  readonly code: string;
  readonly label: string;
  enabled: boolean;
  completionPercent: number;
  rtlReady: boolean;
}

export interface LocalizationSettings {
  languages: LanguageSetting[];
  defaultLocale: string;
  fallbackLocale: string;
  rtlSupportEnabled: boolean;
  regionalFormats: string;
}

export interface IntegrationSetting {
  readonly id: string;
  readonly name: string;
  readonly category: 'api' | 'payment' | 'email' | 'sms' | 'storage';
  readonly description: string;
  status: IntegrationStatus;
  readonly planned: boolean;
}

export interface SystemPreferences {
  defaultTheme: 'light' | 'dark' | 'system';
  defaultDashboardLayout: string;
  sidebarCollapsed: boolean;
  defaultLandingPage: string;
  defaultModule: string;
  navigationDensity: 'comfortable' | 'compact';
}

export interface PlatformSettingsRecord {
  readonly id: string;
  general: GeneralSettings;
  security: SecuritySettings;
  platform: PlatformSettings;
  notifications: NotificationSettings;
  localization: LocalizationSettings;
  integrations: IntegrationSetting[];
  preferences: SystemPreferences;
  readonly updatedAt: string;
}

export interface SettingsFormSnapshot {
  general: GeneralSettings;
  security: SecuritySettings;
  platform: PlatformSettings;
  notifications: NotificationSettings;
  localization: LocalizationSettings;
  integrations: IntegrationSetting[];
  preferences: SystemPreferences;
}
