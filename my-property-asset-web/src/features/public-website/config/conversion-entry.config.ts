import { PublicCtaAction } from '../models/public-section.model';
import {
  AuthEntryExperience,
  ConversionBenefitItem,
  ConversionFeatureHighlight,
  ConversionJourneyStep,
  ConversionPlaceholderEntry,
  ConversionSecurityMessage,
  ConversionSuccessHighlight,
  ConversionTrustBadge,
} from '../models/conversion.model';

export const GET_STARTED_PAGE_HERO = {
  eyebrow: 'Get started',
  title: 'Continue to your property command center',
  subtitle:
    'Sign in to an existing workspace or explore how MyPropertyAsset helps enterprises govern portfolios with clarity and confidence.',
  primaryCta: {
    label: 'Sign in',
    route: '/auth/login',
    intent: 'signin' as const,
    analyticsName: 'get_started_hero_signin',
  },
  secondaryCta: {
    label: 'View pricing',
    route: '/pricing',
    analyticsName: 'get_started_hero_pricing',
  },
};

export const AUTH_ENTRY_EXPERIENCES: Record<'signin' | 'get-started', AuthEntryExperience> = {
  signin: {
    intent: 'signin',
    eyebrow: 'Welcome back',
    title: 'Sign in to MyPropertyAsset',
    subtitle: 'Access your portfolio, projects, and operational insights in one secure workspace.',
    ctaLabel: 'Sign in',
    heroTitle: 'Welcome back to your workspace',
    heroSubtitle:
      'Pick up where you left off — portfolios, organization context, and governed insights await.',
    highlights: [
      'Secure session management',
      'Organization-aware dashboards',
      'Enterprise RBAC protection',
    ],
  },
  'get-started': {
    intent: 'get-started',
    eyebrow: 'Get started',
    title: 'Begin your MyPropertyAsset journey',
    subtitle:
      'Evaluate the platform, connect with our team, or sign in when your organization is ready.',
    ctaLabel: 'Continue to platform',
    heroTitle: 'The premium path into property operations',
    heroSubtitle:
      'Join enterprises that demand clarity, governance, and white-label quality from day one.',
    highlights: [
      'Unified property asset visibility',
      'Enterprise-grade security foundation',
      'Built for builders, investors, and operators',
    ],
  },
};

export const CONVERSION_TRUST_BADGES: readonly ConversionTrustBadge[] = [
  { id: 't1', icon: 'pi pi-shield', label: 'Enterprise security foundation' },
  { id: 't2', icon: 'pi pi-lock', label: 'Organization isolation' },
  { id: 't3', icon: 'pi pi-verified', label: 'SOC 2 readiness framework' },
  { id: 't4', icon: 'pi pi-globe', label: 'GDPR-aware architecture' },
];

export const CONVERSION_SECURITY_MESSAGES: readonly ConversionSecurityMessage[] = [
  {
    id: 's1',
    icon: 'pi pi-shield',
    title: 'Authentication first',
    description: 'Secure sign-in and session lifecycle before any business data is accessed.',
  },
  {
    id: 's2',
    icon: 'pi pi-sitemap',
    title: 'Tenant isolation',
    description: 'Strict organization context boundaries across every portal and navigation surface.',
  },
  {
    id: 's3',
    icon: 'pi pi-eye-slash',
    title: 'Privacy by design',
    description: 'Data handling aligned with enterprise privacy and compliance expectations.',
  },
];

export const CONVERSION_FEATURE_HIGHLIGHTS: readonly ConversionFeatureHighlight[] = [
  {
    id: 'f1',
    icon: 'pi pi-chart-line',
    title: 'Portfolio clarity',
    description: 'Unified visibility across assets, projects, and stakeholders in one governed workspace.',
  },
  {
    id: 'f2',
    icon: 'pi pi-palette',
    title: 'White-label ready',
    description: 'Theme engine and organization branding for investor-grade portal experiences.',
  },
  {
    id: 'f3',
    icon: 'pi pi-users',
    title: 'Role-aware access',
    description: 'RBAC framework scopes navigation and future modules to the right people.',
  },
  {
    id: 'f4',
    icon: 'pi pi-bolt',
    title: 'Built to scale',
    description: 'From evaluation to enterprise rollout without re-platforming your operations.',
  },
];

export const CONVERSION_BENEFITS: readonly ConversionBenefitItem[] = [
  {
    id: 'b1',
    title: 'Frictionless entry',
    description: 'Marketing pages flow naturally into authentication with preserved context and return URLs.',
  },
  {
    id: 'b2',
    title: 'Confidence at every step',
    description: 'Trust indicators, security messaging, and premium visuals reinforce enterprise credibility.',
  },
  {
    id: 'b3',
    title: 'Ready for your team',
    description: 'Organization context, branding, and permissions activate as soon as you sign in.',
  },
];

export const CONVERSION_SUCCESS_HIGHLIGHTS: readonly ConversionSuccessHighlight[] = [
  { id: 'cs1', metric: '40%', label: 'Faster operational reporting' },
  { id: 'cs2', metric: '3×', label: 'Stakeholder alignment in pilots' },
  { id: 'cs3', metric: '4.9/5', label: 'Enterprise experience rating' },
];

export const CONVERSION_JOURNEY_STEPS: readonly ConversionJourneyStep[] = [
  {
    id: 'j1',
    step: 1,
    title: 'Explore the platform',
    description: 'Review pricing, help articles, and company information at your own pace.',
  },
  {
    id: 'j2',
    step: 2,
    title: 'Continue to sign in',
    description: 'Use a secure, premium authentication entry designed for enterprise users.',
  },
  {
    id: 'j3',
    step: 3,
    title: 'Access your workspace',
    description: 'Land in the right portal with organization context and governed permissions.',
  },
];

export const CONVERSION_PLACEHOLDER_ENTRIES: readonly ConversionPlaceholderEntry[] = [
  {
    id: 'invite',
    title: 'Invitation entry',
    description: 'Accept organization invitations with guided onboarding — framework ready for future release.',
    status: 'coming-soon',
    icon: 'pi pi-envelope',
  },
  {
    id: 'trial',
    title: 'Self-service trial',
    description: 'Start a guided evaluation workspace — placeholder for future trial provisioning.',
    status: 'coming-soon',
    icon: 'pi pi-play',
  },
];

export const CONVERSION_STICKY_CTA = {
  title: 'Ready to access your workspace?',
  description: 'Continue with secure sign-in — your return destination is preserved.',
  cta: {
    label: 'Sign in',
    route: '/auth/login',
    intent: 'signin' as const,
    analyticsName: 'conversion_sticky_signin',
  },
};

export const CONVERSION_FLOATING_CTA = {
  label: 'Sign in',
  route: '/auth/login',
  intent: 'signin' as const,
  analyticsName: 'conversion_floating_signin',
};

export const GET_STARTED_FINAL_CTA = {
  title: 'Continue to the platform',
  description: 'Sign in to your workspace or contact our team to plan an enterprise evaluation.',
  primaryCta: {
    label: 'Sign in',
    route: '/auth/login',
    intent: 'signin',
    analyticsName: 'get_started_signin_cta',
  },
  secondaryCta: {
    label: 'Contact sales',
    route: '/contact',
    analyticsName: 'get_started_contact_cta',
  } satisfies PublicCtaAction,
} as const;
