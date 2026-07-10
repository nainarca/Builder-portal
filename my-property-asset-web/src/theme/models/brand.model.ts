export type BrandType = 'platform' | 'organization' | 'builder' | 'partner' | 'marketplace';

export interface BrandAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ManifestMetadata {
  name: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
}

export interface EmailBrandingMetadata {
  headerBackgroundColor: string;
  footerTextColor: string;
  logoUrl?: string;
}

export interface BrandConfiguration {
  id: string;
  type: BrandType;
  name: string;
  shortName: string;
  logo?: BrandAsset;
  logoVariants?: Record<'light' | 'dark' | 'compact' | 'loading', BrandAsset>;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  typography?: {
    fontFamily?: string;
  };
  loadingLogo?: BrandAsset;
  browserThemeColor?: string;
  manifest?: ManifestMetadata;
  emailBranding?: EmailBrandingMetadata;
}

export interface BrandValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface BrandValidationResult {
  valid: boolean;
  issues: readonly BrandValidationIssue[];
}

export interface BrandMetadata {
  version: string;
  lastUpdated: string;
  source: 'platform' | 'runtime' | 'organization';
}
