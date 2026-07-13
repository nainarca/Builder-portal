import { BrandType } from '@theme/models';

export type BrandAdminStatus = 'draft' | 'active' | 'archived';
export type BrandStudioSection = 'identity' | 'logos' | 'colors' | 'typography' | 'themes' | 'assets' | 'preferences';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
export type PreviewSurface = 'dashboard' | 'login' | 'public' | 'email' | 'loading' | 'builder-portal';

export interface BrandLogoSlot {
  readonly key: string;
  readonly label: string;
  readonly src: string;
  readonly alt: string;
  readonly required?: boolean;
}

export interface BrandColorSet {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  surface: string;
  surfaceElevated: string;
  background: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface BrandTypographySet {
  fontFamily: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface BrandThemePreferences {
  mode: 'light' | 'dark' | 'auto' | 'system';
  themePackage: string;
  inheritFrom: string;
}

export interface BrandPreferences {
  defaultLanguage: string;
  defaultTimezone: string;
  defaultCurrency: string;
}

export interface BrandIdentityFields {
  applicationName: string;
  shortName: string;
  companyName: string;
  tagline: string;
  description: string;
}

export interface BrandAdminRecord {
  readonly id: string;
  readonly type: BrandType;
  readonly status: BrandAdminStatus;
  readonly healthScore: number;
  readonly linkedOrganizationId?: string;
  readonly linkedOrganizationName?: string;
  readonly linkedBuilderId?: string;
  readonly linkedBuilderName?: string;
  readonly identity: BrandIdentityFields;
  readonly logos: readonly BrandLogoSlot[];
  readonly colors: BrandColorSet;
  readonly typography: BrandTypographySet;
  readonly theme: BrandThemePreferences;
  readonly preferences: BrandPreferences;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface BrandChangeRecord {
  readonly id: string;
  readonly brandId: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly actor: string;
}

export interface BrandFormModel {
  identity: BrandIdentityFields;
  colors: BrandColorSet;
  typography: BrandTypographySet;
  theme: BrandThemePreferences;
  preferences: BrandPreferences;
  status: BrandAdminStatus;
}
