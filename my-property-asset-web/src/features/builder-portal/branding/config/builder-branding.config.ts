import {
  BuilderBrandingFormModel,
  BuilderBrandingProfile,
  BuilderBrandingStorageAsset,
} from '../models/builder-branding.model';

export const DEFAULT_BUILDER_BRANDING: BuilderBrandingFormModel = {
  companyName: 'Horizon Builders Ltd',
  displayName: 'Horizon Builders',
  shortName: 'HB',
  applicationName: 'Horizon Builder Portal',
  tagline: 'Delivering homes with confidence',
  primaryColor: '#0D4F8B',
  secondaryColor: '#1E6BB8',
  accentColor: '#38BDF8',
  supportEmail: 'support@horizonbuilders.com',
  supportPhone: '+1 415 555 0100',
  website: 'https://horizonbuilders.com',
  officeAddress: '400 Market Street, San Francisco, CA',
  copyright: '© Horizon Builders',
  termsUrl: 'https://horizonbuilders.com/terms',
  privacyPolicyUrl: 'https://horizonbuilders.com/privacy',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/horizonbuilders',
    instagram: '',
    facebook: '',
    x: '',
    youtube: '',
  },
  media: {
    logo: '',
    darkLogo: '',
    favicon: '',
    loginBackground: '',
    dashboardBanner: '',
    mobileSplashImage: '',
  },
  theme: {
    lightTheme: 'light',
    darkTheme: 'dark',
    buttonStyle: 'rounded',
    navigationStyle: 'solid',
    cardStyle: 'soft',
    dashboardTheme: 'default',
    typography: 'dm-sans',
  },
  enabled: true,
};

export const BRANDING_MEDIA_SLOTS: readonly (keyof BuilderBrandingFormModel['media'])[] = [
  'logo',
  'darkLogo',
  'favicon',
  'loginBackground',
  'dashboardBanner',
  'mobileSplashImage',
];

export function buildStorageAssets(organizationId: string): readonly BuilderBrandingStorageAsset[] {
  return BRANDING_MEDIA_SLOTS.map((slot) => ({
    slot,
    path: `branding/${organizationId}/${slot}/`,
  }));
}

export function createBrandingProfile(
  organizationId: string,
  overrides: Partial<BuilderBrandingFormModel> = {},
): BuilderBrandingProfile {
  const base: BuilderBrandingFormModel = {
    ...DEFAULT_BUILDER_BRANDING,
    ...overrides,
    socialLinks: {
      ...DEFAULT_BUILDER_BRANDING.socialLinks,
      ...overrides.socialLinks,
    },
    media: {
      ...DEFAULT_BUILDER_BRANDING.media,
      ...overrides.media,
    },
    theme: {
      ...DEFAULT_BUILDER_BRANDING.theme,
      ...overrides.theme,
    },
  };

  return {
    organizationId,
    ...base,
    lastUpdatedAt: new Date('2026-07-16T08:00:00Z').toISOString(),
  };
}
