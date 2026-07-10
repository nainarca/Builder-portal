import type { ThemeModePreference } from '../../../theme/models';

export interface UserPreferences {
  language: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  timezone: string;
  themeMode: ThemeModePreference;
}

export interface ApplicationPreferences {
  defaultLanguage: string;
  defaultTimezone: string;
  defaultCurrency: string;
  rtlReady: boolean;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'en-US',
  dateFormat: 'medium',
  timeFormat: 'short',
  currency: 'USD',
  timezone: 'UTC',
  themeMode: 'system',
};

export const DEFAULT_APPLICATION_PREFERENCES: ApplicationPreferences = {
  defaultLanguage: 'en-US',
  defaultTimezone: 'UTC',
  defaultCurrency: 'USD',
  rtlReady: true,
};
