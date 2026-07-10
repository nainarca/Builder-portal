import { BrandConfiguration, BrandMetadata } from './brand.model';
import { CssVariableMap, DesignTokens } from './design-token.model';

export type ThemeModePreference = 'light' | 'dark' | 'auto' | 'system';

export type ResolvedThemeMode = 'light' | 'dark';

export type ThemePackageType =
  'platform-default' | 'organization' | 'builder' | 'partner' | 'marketplace';

export interface ThemeOverrides {
  cssVariables?: CssVariableMap;
  primePresetOverrides?: Record<string, unknown>;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  type: ThemePackageType;
  extends?: string;
  mode: ThemeModePreference;
  tokens: DesignTokens;
  brand: BrandConfiguration;
  overrides?: ThemeOverrides;
  metadata?: BrandMetadata;
}

export interface ThemeContext {
  themeId: string;
  packageType: ThemePackageType;
  organizationId?: string;
  builderId?: string;
  partnerId?: string;
}

export interface ThemeConfiguration {
  defaultThemeId: string;
  persistenceKey: string;
  supportedModes: readonly ThemeModePreference[];
  allowOrganizationOverride: boolean;
}

export interface ThemePersistenceState {
  mode: ThemeModePreference;
  themeId?: string;
  userPreference?: ThemeModePreference;
}

export interface ThemeValidationResult {
  valid: boolean;
  issues: readonly string[];
}
