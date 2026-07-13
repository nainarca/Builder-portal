import {
  PublicAudienceBenefit,
  PublicCtaAction,
  PublicFeatureItem,
  PublicStatisticItem,
  PublicStepItem,
  PublicTestimonialItem,
  PublicTrustBadge,
  PublicTrustedLogo,
} from '../models/public-section.model';

export const PUBLIC_WEBSITE_BRAND = {
  name: 'MyPropertyAsset',
  tagline: 'The operating system for modern property enterprises',
  description:
    'MyPropertyAsset unifies portfolios, projects, and stakeholders in one premium platform — giving builders, owners, managers, and investors the clarity to move with confidence.',
} as const;

export const PUBLIC_HERO_CONTENT = {
  eyebrow: 'Enterprise property intelligence',
  title: 'Every property asset. One source of truth.',
  subtitle:
    'Replace fragmented spreadsheets and disconnected tools with a platform built for governance, visibility, and white-label scale — from first project to full portfolio.',
  primaryCta: {
    label: 'Request a demo',
    route: '/auth/login',
    analyticsName: 'public_hero_demo_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'See how it works',
    route: '/',
    fragment: 'how-it-works',
    analyticsName: 'public_hero_how_it_works_cta',
  },
  highlights: [
    'Portfolio-wide visibility in real time',
    'Enterprise security with organization isolation',
    'White-label portals for every stakeholder',
  ],
} as const;

export const PUBLIC_TRUSTED_LOGOS: readonly PublicTrustedLogo[] = [
  { id: 'summit', name: 'Summit Developments', category: 'builder', initials: 'SD' },
  { id: 'northline', name: 'Northline Builders', category: 'builder', initials: 'NB' },
  { id: 'atlas', name: 'Atlas Property Group', category: 'client', initials: 'AP' },
  { id: 'harbor', name: 'Harbor Estates', category: 'client', initials: 'HE' },
  { id: 'vertex', name: 'Vertex Capital', category: 'partner', initials: 'VC' },
  { id: 'crest', name: 'Crest Holdings', category: 'partner', initials: 'CH' },
];

export const PUBLIC_FEATURES: readonly PublicFeatureItem[] = [
  {
    id: 'portfolio',
    icon: 'chart-line',
    title: 'Portfolio command center',
    highlight: 'Visibility',
    description:
      'Executive dashboards and operational views across assets, developments, and stakeholders — always current, always aligned.',
  },
  {
    id: 'governance',
    icon: 'shield',
    title: 'Governance & compliance',
    highlight: 'Trust',
    description:
      'Role-aware access, audit-ready workflows, and organization context designed for enterprise accountability.',
  },
  {
    id: 'whitelabel',
    icon: 'palette',
    title: 'White-label experiences',
    highlight: 'Brand',
    description:
      'Launch branded portals with your identity — logos, themes, and navigation that feel native to every organization.',
  },
  {
    id: 'collaboration',
    icon: 'users',
    title: 'Stakeholder collaboration',
    highlight: 'Alignment',
    description:
      'Connect builders, owners, managers, and investors with permissions that match how your business actually operates.',
  },
  {
    id: 'insights',
    icon: 'sparkles',
    title: 'Operational intelligence',
    highlight: 'Insight',
    description:
      'Surface the metrics that drive decisions with premium reporting foundations built for leadership and field teams alike.',
  },
  {
    id: 'scale',
    icon: 'sitemap',
    title: 'Enterprise scale',
    highlight: 'Scale',
    description:
      'Multi-organization architecture, lazy-loaded modules, and performance-first engineering that grows with your portfolio.',
  },
];

export const PUBLIC_AUDIENCE_BENEFITS: readonly PublicAudienceBenefit[] = [
  {
    id: 'owners',
    audience: 'Property Owners',
    icon: 'pi pi-home',
    title: 'Portfolio clarity at every level',
    description: 'See performance, risk, and opportunity across your entire asset base without chasing updates.',
    outcomes: ['Unified asset registers', 'Investor-ready reporting', 'Stakeholder transparency'],
  },
  {
    id: 'builders',
    audience: 'Builders',
    icon: 'pi pi-building',
    title: 'Deliver projects with confidence',
    description: 'Coordinate developments, units, and customer experiences from one governed workspace.',
    outcomes: ['Project-to-unit traceability', 'Branded buyer portals', 'Operational handover'],
  },
  {
    id: 'managers',
    audience: 'Property Managers',
    icon: 'pi pi-briefcase',
    title: 'Run operations without friction',
    description: 'Standardize workflows, permissions, and communications across properties and teams.',
    outcomes: ['Role-based task visibility', 'Consistent service delivery', 'Audit-ready history'],
  },
  {
    id: 'investors',
    audience: 'Investors',
    icon: 'pi pi-chart-bar',
    title: 'Decisions backed by live data',
    description: 'Access the metrics and narratives that matter — structured, current, and presentation-ready.',
    outcomes: ['KPI dashboards', 'Portfolio benchmarking', 'Secure data rooms'],
  },
];

export const PUBLIC_STATISTICS: readonly PublicStatisticItem[] = [
  {
    id: 'assets',
    value: '12K+',
    numericValue: 12,
    suffix: 'K+',
    label: 'Assets under management',
    hint: 'Platform capacity',
  },
  {
    id: 'uptime',
    value: '99.9%',
    numericValue: 99.9,
    suffix: '%',
    label: 'Target platform availability',
    hint: 'Enterprise SLA',
  },
  {
    id: 'time',
    value: '40%',
    numericValue: 40,
    suffix: '%',
    label: 'Faster operational reporting',
    hint: 'Customer benchmark',
  },
  {
    id: 'satisfaction',
    value: '4.9',
    numericValue: 4.9,
    label: 'Experience satisfaction',
    hint: 'Pilot program average',
  },
];

export const PUBLIC_STEPS: readonly PublicStepItem[] = [
  {
    id: 'discover',
    step: 1,
    icon: 'pi pi-compass',
    title: 'Discover your operating model',
    description: 'Map organizations, roles, and portfolios to the platform’s multi-tenant foundation.',
  },
  {
    id: 'configure',
    step: 2,
    icon: 'pi pi-sliders-h',
    title: 'Configure branded workspaces',
    description: 'Apply themes, permissions, and navigation tailored to each stakeholder group.',
  },
  {
    id: 'launch',
    step: 3,
    icon: 'pi pi-send',
    title: 'Launch with confidence',
    description: 'Onboard teams and go live with enterprise security, governance, and support built in.',
  },
  {
    id: 'scale',
    step: 4,
    icon: 'pi pi-arrow-up-right',
    title: 'Scale across portfolios',
    description: 'Expand to new developments, partners, and markets without rebuilding your stack.',
  },
];

export const PUBLIC_TESTIMONIALS: readonly PublicTestimonialItem[] = [
  {
    id: 't1',
    quote:
      'MyPropertyAsset gave our leadership team a single source of truth across developments. The experience feels world-class — our investors noticed immediately.',
    author: 'Priya Sharma',
    role: 'Chief Operating Officer',
    organization: 'Summit Developments',
    initials: 'PS',
  },
  {
    id: 't2',
    quote:
      'Governance and white-label capabilities let us launch branded portals without a custom build. We went from concept to demo-ready in weeks.',
    author: 'Marcus Chen',
    role: 'Head of Digital',
    organization: 'Northline Builders',
    initials: 'MC',
  },
  {
    id: 't3',
    quote:
      'For the first time, our property managers and investors are looking at the same numbers. That alignment alone transformed how we operate.',
    author: 'Elena Vasquez',
    role: 'Managing Director',
    organization: 'Atlas Property Group',
    initials: 'EV',
  },
];

export const PUBLIC_TRUST_BADGES: readonly PublicTrustBadge[] = [
  { id: 'security', icon: 'pi pi-shield', label: 'Enterprise-grade security' },
  { id: 'compliance', icon: 'pi pi-verified', label: 'Audit-ready governance' },
  { id: 'support', icon: 'pi pi-headphones', label: 'Dedicated success team' },
];

export const PUBLIC_FINAL_CTA = {
  title: 'See why property leaders choose MyPropertyAsset',
  description:
    'Join builders, owners, and operators who demand a platform as polished as the properties they deliver.',
  primaryCta: {
    label: 'Book a demo',
    route: '/auth/login',
    analyticsName: 'public_footer_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'Explore features',
    route: '/',
    fragment: 'features',
    analyticsName: 'public_features_cta',
  },
} as const;

export const PUBLIC_SECTION_IDS = {
  trustedBy: 'trusted-by',
  features: 'features',
  benefits: 'benefits',
  statistics: 'statistics',
  howItWorks: 'how-it-works',
  testimonials: 'testimonials',
} as const;
