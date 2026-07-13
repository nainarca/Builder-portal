import {
  PlatformSettingsRecord,
  SettingsCategoryId,
  SettingsChangeRecord,
  SettingsNavItem,
  SettingsSearchItem,
} from '../models/settings-admin.model';

export const SETTINGS_CATEGORIES: readonly SettingsNavItem[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Platform information, defaults, and regional settings',
    icon: 'pi pi-sliders-h',
    route: '/super-admin/settings/general',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Password, session, authentication, and login policies',
    icon: 'pi pi-shield',
    route: '/super-admin/settings/security',
  },
  {
    id: 'platform',
    label: 'Platform',
    description: 'Feature flags, maintenance mode, and configuration status',
    icon: 'pi pi-server',
    route: '/super-admin/settings/platform',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Email, in-app, SMS, and push notification preferences',
    icon: 'pi pi-bell',
    route: '/super-admin/settings/notifications',
  },
  {
    id: 'localization',
    label: 'Localization',
    description: 'Languages, translations, and regional configuration',
    icon: 'pi pi-globe',
    route: '/super-admin/settings/localization',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'API, payment, email, SMS, and storage providers',
    icon: 'pi pi-link',
    route: '/super-admin/settings/integrations',
  },
  {
    id: 'preferences',
    label: 'System Preferences',
    description: 'Theme, dashboard, navigation, and landing defaults',
    icon: 'pi pi-cog',
    route: '/super-admin/settings/preferences',
  },
];

export const SETTINGS_SEARCH_INDEX: readonly SettingsSearchItem[] = [
  { id: 'gen-platform-name', label: 'Platform name', description: 'Application display name', category: 'general', route: '/super-admin/settings/general', keywords: ['name', 'title', 'application'] },
  { id: 'gen-timezone', label: 'Default timezone', description: 'Platform default timezone', category: 'general', route: '/super-admin/settings/general', keywords: ['timezone', 'time', 'region'] },
  { id: 'gen-currency', label: 'Default currency', description: 'Platform default currency', category: 'general', route: '/super-admin/settings/general', keywords: ['currency', 'money', 'finance'] },
  { id: 'gen-language', label: 'Default language', description: 'Platform default language', category: 'general', route: '/super-admin/settings/general', keywords: ['language', 'locale', 'i18n'] },
  { id: 'sec-password', label: 'Password policy', description: 'Minimum length and complexity rules', category: 'security', route: '/super-admin/settings/security', keywords: ['password', 'security', 'policy'] },
  { id: 'sec-session', label: 'Session policy', description: 'Idle and absolute session timeouts', category: 'security', route: '/super-admin/settings/security', keywords: ['session', 'timeout', 'idle'] },
  { id: 'sec-mfa', label: 'Multi-factor authentication', description: 'Require MFA for platform access', category: 'security', route: '/super-admin/settings/security', keywords: ['mfa', '2fa', 'authentication'] },
  { id: 'plat-flags', label: 'Feature flags', description: 'Enable or disable platform features', category: 'platform', route: '/super-admin/settings/platform', keywords: ['feature', 'flag', 'toggle'] },
  { id: 'plat-maintenance', label: 'Maintenance mode', description: 'Platform-wide maintenance banner', category: 'platform', route: '/super-admin/settings/platform', keywords: ['maintenance', 'downtime', 'banner'] },
  { id: 'notif-email', label: 'Email notifications', description: 'Email channel configuration', category: 'notifications', route: '/super-admin/settings/notifications', keywords: ['email', 'notification', 'mail'] },
  { id: 'notif-templates', label: 'Notification templates', description: 'Preview and manage templates', category: 'notifications', route: '/super-admin/settings/notifications', keywords: ['template', 'notification'] },
  { id: 'loc-languages', label: 'Supported languages', description: 'Language availability and translation status', category: 'localization', route: '/super-admin/settings/localization', keywords: ['language', 'translation', 'locale'] },
  { id: 'loc-rtl', label: 'RTL readiness', description: 'Right-to-left language support', category: 'localization', route: '/super-admin/settings/localization', keywords: ['rtl', 'arabic', 'hebrew'] },
  { id: 'int-api', label: 'API integrations', description: 'Future API provider connections', category: 'integrations', route: '/super-admin/settings/integrations', keywords: ['api', 'integration', 'webhook'] },
  { id: 'int-payment', label: 'Payment providers', description: 'Future payment gateway connections', category: 'integrations', route: '/super-admin/settings/integrations', keywords: ['payment', 'stripe', 'billing'] },
  { id: 'pref-theme', label: 'Default theme', description: 'Platform default theme mode', category: 'preferences', route: '/super-admin/settings/preferences', keywords: ['theme', 'dark', 'light'] },
  { id: 'pref-landing', label: 'Default landing page', description: 'Post-login landing destination', category: 'preferences', route: '/super-admin/settings/preferences', keywords: ['landing', 'home', 'dashboard'] },
];

export const MOCK_SETTINGS_CHANGES: readonly SettingsChangeRecord[] = [
  { id: 'chg-1', title: 'Maintenance mode disabled', category: 'platform', changedBy: 'Alex Rivera', changedAt: '2026-07-12T14:30:00Z' },
  { id: 'chg-2', title: 'Password minimum length increased to 12', category: 'security', changedBy: 'Jordan Lee', changedAt: '2026-07-11T09:15:00Z' },
  { id: 'chg-3', title: 'Default timezone set to Asia/Kolkata', category: 'general', changedBy: 'Alex Rivera', changedAt: '2026-07-10T16:45:00Z' },
  { id: 'chg-4', title: 'Email digest frequency changed to daily', category: 'notifications', changedBy: 'Sam Patel', changedAt: '2026-07-09T11:20:00Z' },
  { id: 'chg-5', title: 'Hindi translation marked 85% complete', category: 'localization', changedBy: 'Priya Sharma', changedAt: '2026-07-08T08:00:00Z' },
];

export const DEFAULT_PINNED_IDS = ['plat-maintenance', 'sec-password', 'gen-timezone'] as const;
export const DEFAULT_FAVORITE_IDS = ['plat-flags', 'sec-mfa', 'pref-theme'] as const;

export const MOCK_PLATFORM_SETTINGS: PlatformSettingsRecord = {
  id: 'platform-settings',
  updatedAt: '2026-07-12T14:30:00Z',
  general: {
    platformName: 'MyPropertyAsset',
    platformTagline: 'Enterprise property asset management',
    supportEmail: 'support@mypropertyasset.com',
    defaultLanguage: 'en-US',
    defaultTimezone: 'Asia/Kolkata',
    defaultCurrency: 'INR',
    dateFormat: 'dd MMM yyyy',
    timeFormat: 'HH:mm',
    numberFormat: 'en-IN',
  },
  security: {
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      expiryDays: 90,
    },
    sessionPolicy: {
      idleTimeoutMinutes: 30,
      absoluteTimeoutHours: 12,
      rememberMeDays: 14,
      singleSessionOnly: false,
    },
    authenticationPolicy: {
      mfaRequired: true,
      ssoEnabled: false,
      socialLoginEnabled: false,
      passwordlessEnabled: false,
    },
    loginRestrictions: {
      maxFailedAttempts: 5,
      lockoutMinutes: 15,
      ipAllowlistEnabled: false,
      geoRestrictionEnabled: false,
    },
  },
  platform: {
    maintenanceMode: false,
    maintenanceMessage: 'Scheduled maintenance in progress. We will be back shortly.',
    configurationStatus: 'healthy',
    featureFlags: [
      { id: 'builder-portal', label: 'Builder Portal', description: 'Enable builder organization portal', enabled: true, environment: 'all' },
      { id: 'investor-portal', label: 'Investor Portal', description: 'Investor-facing portal (preview)', enabled: false, environment: 'staging' },
      { id: 'marketplace', label: 'Marketplace', description: 'Property marketplace module', enabled: false, environment: 'development' },
      { id: 'ai-assistant', label: 'AI Assistant', description: 'Platform AI copilot features', enabled: true, environment: 'all' },
      { id: 'advanced-analytics', label: 'Advanced Analytics', description: 'Enterprise analytics dashboards', enabled: false, environment: 'uat' },
    ],
    platformMessages: [
      { id: 'msg-1', title: 'Platform update', message: 'Version 2.4 deployed successfully.', severity: 'info', active: true },
      { id: 'msg-2', title: 'Security notice', message: 'MFA enforcement begins next month.', severity: 'warning', active: false },
    ],
  },
  notifications: {
    channels: { emailEnabled: true, inAppEnabled: true, smsEnabled: false, pushEnabled: false },
    digestFrequency: 'daily',
    templates: [
      { id: 'tpl-welcome', name: 'Welcome email', channel: 'email', enabled: true, previewSubject: 'Welcome to MyPropertyAsset' },
      { id: 'tpl-invite', name: 'User invitation', channel: 'email', enabled: true, previewSubject: 'You have been invited' },
      { id: 'tpl-alert', name: 'Security alert', channel: 'in-app', enabled: true, previewSubject: 'Security alert' },
      { id: 'tpl-digest', name: 'Weekly digest', channel: 'email', enabled: false, previewSubject: 'Your weekly summary' },
    ],
  },
  localization: {
    languages: [
      { code: 'en-US', label: 'English (US)', enabled: true, completionPercent: 100, rtlReady: false },
      { code: 'en-GB', label: 'English (UK)', enabled: true, completionPercent: 100, rtlReady: false },
      { code: 'hi-IN', label: 'Hindi', enabled: true, completionPercent: 85, rtlReady: false },
      { code: 'ar-SA', label: 'Arabic', enabled: false, completionPercent: 42, rtlReady: true },
      { code: 'fr-FR', label: 'French', enabled: false, completionPercent: 60, rtlReady: false },
    ],
    defaultLocale: 'en-US',
    fallbackLocale: 'en-US',
    rtlSupportEnabled: true,
    regionalFormats: 'en-IN',
  },
  integrations: [
    { id: 'int-supabase', name: 'Supabase', category: 'api', description: 'Primary backend and auth provider', status: 'connected', planned: false },
    { id: 'int-sendgrid', name: 'SendGrid', category: 'email', description: 'Transactional email delivery', status: 'planned', planned: true },
    { id: 'int-stripe', name: 'Stripe', category: 'payment', description: 'Payment processing and billing', status: 'planned', planned: true },
    { id: 'int-twilio', name: 'Twilio', category: 'sms', description: 'SMS notifications and verification', status: 'planned', planned: true },
    { id: 'int-s3', name: 'AWS S3', category: 'storage', description: 'Document and asset storage', status: 'planned', planned: true },
    { id: 'int-webhook', name: 'Webhooks', category: 'api', description: 'Outbound event webhooks', status: 'disconnected', planned: true },
  ],
  preferences: {
    defaultTheme: 'system',
    defaultDashboardLayout: 'executive',
    sidebarCollapsed: false,
    defaultLandingPage: '/super-admin',
    defaultModule: 'dashboard',
    navigationDensity: 'comfortable',
  },
};

export function getCategoryById(id: SettingsCategoryId): SettingsNavItem | undefined {
  return SETTINGS_CATEGORIES.find((c) => c.id === id);
}
