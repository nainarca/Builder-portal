import {
  PublicBenefitItem,
  PublicCtaAction,
  PublicFaqItem,
  PublicFeatureItem,
  PublicPricingTier,
  PublicStatisticItem,
  PublicStepItem,
  PublicTestimonialItem,
} from '../models/public-section.model';

export const PUBLIC_WEBSITE_BRAND = {
  name: 'MyPropertyAsset',
  tagline: 'Property intelligence for modern enterprises',
  description:
    'Unify portfolios, projects, and stakeholders in one premium platform built for builders, investors, and operators.',
} as const;

export const PUBLIC_HERO_CONTENT = {
  eyebrow: 'Enterprise property platform',
  title: 'Clarity and control across every property asset',
  subtitle:
    'MyPropertyAsset brings portfolio visibility, governance, and white-label experiences together — so your teams move faster with confidence.',
  primaryCta: {
    label: 'Request a demo',
    route: '/auth/login',
    analyticsName: 'public_hero_demo_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'Explore features',
    route: '/',
    fragment: 'features',
    analyticsName: 'public_hero_features_cta',
  },
  highlights: [
    'Unified asset and project visibility',
    'Enterprise-grade security and RBAC',
    'White-label ready for every organization',
  ],
} as const;

export const PUBLIC_FEATURES: readonly PublicFeatureItem[] = [
  {
    id: 'portfolio',
    icon: 'pi pi-chart-line',
    title: 'Portfolio intelligence',
    description:
      'Executive dashboards and operational views across assets, projects, and stakeholders in one place.',
  },
  {
    id: 'governance',
    icon: 'pi pi-shield',
    title: 'Governance by design',
    description:
      'Role-aware access, audit-ready workflows, and organization context that scales with your enterprise.',
  },
  {
    id: 'whitelabel',
    icon: 'pi pi-palette',
    title: 'White-label experiences',
    description:
      'Brand every portal with your identity — logos, colors, and themes that feel native to your organization.',
  },
  {
    id: 'collaboration',
    icon: 'pi pi-users',
    title: 'Stakeholder collaboration',
    description:
      'Connect builders, owners, partners, and operators with context-aware navigation and permissions.',
  },
  {
    id: 'insights',
    icon: 'pi pi-sparkles',
    title: 'Operational insights',
    description:
      'Surface the metrics that matter with premium cards, statistics, and reporting foundations.',
  },
  {
    id: 'scale',
    icon: 'pi pi-sitemap',
    title: 'Built to scale',
    description:
      'Multi-organization architecture, lazy-loaded modules, and performance-first engineering.',
  },
];

export const PUBLIC_BENEFITS: readonly PublicBenefitItem[] = [
  {
    id: 'speed',
    icon: 'pi pi-bolt',
    title: 'Move faster',
    description: 'Reduce time spent reconciling spreadsheets and disconnected tools.',
  },
  {
    id: 'trust',
    icon: 'pi pi-verified',
    title: 'Earn trust',
    description: 'Deliver polished, consistent experiences to customers and investors.',
  },
  {
    id: 'control',
    icon: 'pi pi-sliders-h',
    title: 'Stay in control',
    description: 'Configure organizations, roles, and branding without engineering cycles.',
  },
];

export const PUBLIC_STATISTICS: readonly PublicStatisticItem[] = [
  { id: 'orgs', value: '50+', label: 'Organizations supported', hint: 'Multi-tenant ready' },
  { id: 'uptime', value: '99.9%', label: 'Platform availability target', hint: 'Enterprise SLA' },
  { id: 'time', value: '40%', label: 'Faster operational reporting', hint: 'Customer benchmark' },
  { id: 'satisfaction', value: '4.9/5', label: 'Experience satisfaction', hint: 'Pilot programs' },
];

export const PUBLIC_STEPS: readonly PublicStepItem[] = [
  {
    id: 'connect',
    step: 1,
    title: 'Connect your organization',
    description: 'Onboard teams with secure authentication and organization context.',
  },
  {
    id: 'configure',
    step: 2,
    title: 'Configure your workspace',
    description: 'Apply branding, roles, and navigation tailored to your operating model.',
  },
  {
    id: 'operate',
    step: 3,
    title: 'Operate with clarity',
    description: 'Manage assets and projects with premium tools designed for enterprise scale.',
  },
];

export const PUBLIC_TESTIMONIALS: readonly PublicTestimonialItem[] = [
  {
    id: 't1',
    quote:
      'MyPropertyAsset gave our leadership team a single source of truth across developments — the experience feels world-class.',
    author: 'Priya Sharma',
    role: 'COO',
    organization: 'Summit Developments',
  },
  {
    id: 't2',
    quote:
      'The platform’s governance and white-label capabilities let us launch branded portals without a custom build.',
    author: 'Marcus Chen',
    role: 'Head of Digital',
    organization: 'Northline Builders',
  },
];

export const PUBLIC_PRICING_PREVIEW: readonly PublicPricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Custom',
    period: 'per organization',
    description: 'For growing builders establishing operational excellence.',
    features: ['Core portfolio views', 'Organization branding', 'Role-based access'],
    ctaLabel: 'Talk to sales',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual',
    description: 'For enterprises requiring scale, governance, and premium support.',
    features: [
      'Everything in Starter',
      'Multi-organization support',
      'Advanced governance',
      'Dedicated success',
    ],
    highlighted: true,
    ctaLabel: 'Request pricing',
  },
  {
    id: 'platform',
    name: 'Platform',
    price: 'Custom',
    period: 'partnership',
    description: 'For partners and marketplace operators extending the ecosystem.',
    features: ['Partner branding', 'Marketplace foundations', 'API readiness'],
    ctaLabel: 'Partner with us',
  },
];

export const PUBLIC_FAQ: readonly PublicFaqItem[] = [
  {
    id: 'faq-1',
    question: 'Who is MyPropertyAsset built for?',
    answer:
      'MyPropertyAsset serves property builders, asset operators, investors, and enterprise teams that need unified visibility, governance, and branded experiences.',
  },
  {
    id: 'faq-2',
    question: 'Does the platform support multiple organizations?',
    answer:
      'Yes. The foundation includes multi-organization context, switching, and white-label branding designed for enterprise SaaS scale.',
  },
  {
    id: 'faq-3',
    question: 'Can we use our own branding?',
    answer:
      'Absolutely. Organization branding, theme resolution, and logo support are built into the platform theme engine.',
  },
  {
    id: 'faq-4',
    question: 'Is MyPropertyAsset secure?',
    answer:
      'Security is foundational — authentication, session management, RBAC, and organization isolation are implemented before business modules.',
  },
];

export const PUBLIC_FINAL_CTA = {
  title: 'Ready to elevate your property operations?',
  description:
    'Join forward-thinking builders and operators who demand clarity, control, and a premium experience.',
  primaryCta: {
    label: 'Get started',
    route: '/auth/login',
    analyticsName: 'public_footer_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'Contact sales',
    route: '/',
    fragment: 'contact',
    analyticsName: 'public_contact_cta',
  },
} as const;

export const PUBLIC_SECTION_IDS = {
  features: 'features',
  benefits: 'benefits',
  statistics: 'statistics',
  howItWorks: 'how-it-works',
  testimonials: 'testimonials',
  pricing: 'pricing',
  faq: 'faq',
  contact: 'contact',
} as const;
