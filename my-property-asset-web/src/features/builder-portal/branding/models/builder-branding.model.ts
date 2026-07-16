import { BrandConfiguration } from '@theme/models';

export type BrandingThemeMode = 'light' | 'dark' | 'system';
export type BrandingButtonStyle = 'rounded' | 'pill' | 'sharp';
export type BrandingNavigationStyle = 'solid' | 'elevated' | 'minimal';
export type BrandingCardStyle = 'soft' | 'outlined' | 'elevated';
export type BrandingDashboardTheme = 'default' | 'compact' | 'executive';
export type BrandingTypography = 'inter' | 'dm-sans' | 'plus-jakarta' | 'system';

export interface BuilderSocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  youtube?: string;
}

export interface BuilderBrandingMedia {
  logo: string;
  darkLogo: string;
  favicon: string;
  loginBackground: string;
  dashboardBanner: string;
  mobileSplashImage: string;
}

export interface BuilderBrandingThemeSettings {
  lightTheme: BrandingThemeMode;
  darkTheme: BrandingThemeMode;
  buttonStyle: BrandingButtonStyle;
  navigationStyle: BrandingNavigationStyle;
  cardStyle: BrandingCardStyle;
  dashboardTheme: BrandingDashboardTheme;
  typography: BrandingTypography;
}

export interface BuilderBrandingProfile {
  readonly organizationId: string;
  readonly companyName: string;
  readonly displayName: string;
  readonly shortName: string;
  readonly applicationName: string;
  readonly tagline: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly accentColor: string;
  readonly supportEmail: string;
  readonly supportPhone: string;
  readonly website: string;
  readonly officeAddress: string;
  readonly copyright: string;
  readonly termsUrl: string;
  readonly privacyPolicyUrl: string;
  readonly socialLinks: BuilderSocialLinks;
  readonly media: BuilderBrandingMedia;
  readonly theme: BuilderBrandingThemeSettings;
  readonly enabled: boolean;
  readonly lastUpdatedAt: string;
}

export interface BuilderBrandingFormModel {
  companyName: string;
  displayName: string;
  shortName: string;
  applicationName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  supportEmail: string;
  supportPhone: string;
  website: string;
  officeAddress: string;
  copyright: string;
  termsUrl: string;
  privacyPolicyUrl: string;
  socialLinks: BuilderSocialLinks;
  media: BuilderBrandingMedia;
  theme: BuilderBrandingThemeSettings;
  enabled: boolean;
}

export interface BrandingCompletionStatus {
  readonly completionPercent: number;
  readonly missingItems: readonly string[];
  readonly statusLabel: 'Draft' | 'In Progress' | 'Configured';
}

export interface BuilderBrandingStorageAsset {
  readonly slot: keyof BuilderBrandingMedia;
  readonly path: string;
}

export interface FlutterBrandingPayload {
  readonly organizationId: string;
  readonly displayName: string;
  readonly shortName: string;
  readonly applicationName: string;
  readonly tagline: string;
  readonly logo: string;
  readonly darkLogo: string;
  readonly favicon: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly accentColor: string;
  readonly supportEmail: string;
  readonly supportPhone: string;
  readonly website: string;
  readonly officeAddress: string;
  readonly socialLinks: BuilderSocialLinks;
  readonly termsUrl: string;
  readonly privacyPolicyUrl: string;
  readonly theme: BuilderBrandingThemeSettings;
}

export interface BuilderBrandPreviewRecord {
  readonly brand: BrandConfiguration;
  readonly surfaceName: string;
}
