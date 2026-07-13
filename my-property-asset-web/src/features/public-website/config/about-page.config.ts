import { PublicCtaAction } from '../models/public-section.model';
import {
  CompanyStoryContent,
  CoreValueItem,
  MissionVisionItem,
  PageHeroContent,
  PlatformHighlight,
  RoadmapItem,
  TechStackItem,
  TimelineEvent,
  WhyUsItem,
} from '../models/company.model';

export const ABOUT_PAGE_HERO: PageHeroContent = {
  eyebrow: 'About MyPropertyAsset',
  title: 'Building the operating system for modern property enterprises',
  subtitle:
    'We believe property operations deserve the same clarity, governance, and craft as the world’s best enterprise software — because portfolios, people, and investors depend on it.',
  primaryCta: {
    label: 'Explore the platform',
    route: '/',
    analyticsName: 'about_hero_platform_cta',
  },
  secondaryCta: {
    label: 'View pricing',
    route: '/pricing',
    analyticsName: 'about_hero_pricing_cta',
  },
};

export const ABOUT_COMPANY_STORY: CompanyStoryContent = {
  title: 'Our story',
  paragraphs: [
    'MyPropertyAsset was founded to solve a problem we saw across the property industry: critical decisions were being made from fragmented spreadsheets, disconnected tools, and outdated reports.',
    'We set out to build a platform where builders, owners, managers, and investors share one governed source of truth — with the premium experience stakeholders expect from modern enterprise software.',
    'Today, MyPropertyAsset is the foundation for organizations that refuse to compromise on visibility, security, or brand quality as they scale.',
  ],
};

export const ABOUT_MISSION_VISION: readonly MissionVisionItem[] = [
  {
    id: 'mission',
    label: 'Mission',
    title: 'Clarity for every property stakeholder',
    description:
      'Empower property enterprises with unified visibility, governance, and white-label experiences that accelerate confident decisions.',
    icon: 'pi pi-compass',
  },
  {
    id: 'vision',
    label: 'Vision',
    title: 'The global standard for property operations',
    description:
      'A world where every portfolio — from first development to institutional scale — runs on trustworthy, beautiful, enterprise-grade technology.',
    icon: 'pi pi-eye',
  },
];

export const ABOUT_CORE_VALUES: readonly CoreValueItem[] = [
  {
    id: 'trust',
    icon: 'pi pi-shield',
    title: 'Trust by design',
    description: 'Security, governance, and organization isolation are foundational — never afterthoughts.',
  },
  {
    id: 'craft',
    icon: 'pi pi-sparkles',
    title: 'Craft matters',
    description: 'We build interfaces and experiences worthy of executive boards and field teams alike.',
  },
  {
    id: 'clarity',
    icon: 'pi pi-chart-line',
    title: 'Clarity over complexity',
    description: 'We reduce noise so teams can focus on assets, projects, and outcomes that matter.',
  },
  {
    id: 'partnership',
    icon: 'pi pi-users',
    title: 'Partnership mindset',
    description: 'We succeed when our customers launch faster, operate smarter, and scale with confidence.',
  },
];

export const ABOUT_WHY_US: readonly WhyUsItem[] = [
  {
    id: 'foundation',
    title: 'Platform-first architecture',
    description: 'Multi-tenant organization context, RBAC, and white-label branding built before business modules.',
  },
  {
    id: 'experience',
    title: 'Premium by default',
    description: 'Every surface is designed for enterprise demonstrations, investor reviews, and daily operations.',
  },
  {
    id: 'scale',
    title: 'Built to grow with you',
    description: 'From a single organization to multi-portfolio enterprises — without re-platforming.',
  },
];

export const ABOUT_JOURNEY: readonly TimelineEvent[] = [
  {
    id: 'j1',
    year: '2022',
    title: 'The idea takes shape',
    description: 'Founders identify the gap between property operations reality and enterprise software quality.',
  },
  {
    id: 'j2',
    year: '2023',
    title: 'Foundation sprint',
    description: 'Platform architecture, authentication, and organization context established as core pillars.',
  },
  {
    id: 'j3',
    year: '2024',
    title: 'Pilot programs',
    description: 'Early builder and operator partners validate governance, branding, and portfolio visibility.',
  },
  {
    id: 'j4',
    year: '2025',
    title: 'Enterprise readiness',
    description: 'Public website, pricing, and company pages launch ahead of full business module rollout.',
  },
];

export const ABOUT_PLATFORM_HIGHLIGHTS: readonly PlatformHighlight[] = [
  {
    id: 'auth',
    icon: 'pi pi-lock',
    title: 'Authentication & sessions',
    description: 'Enterprise sign-in, session management, and secure token lifecycle.',
  },
  {
    id: 'org',
    icon: 'pi pi-sitemap',
    title: 'Organization context',
    description: 'Multi-tenant foundation with switching, branding, and isolation.',
  },
  {
    id: 'rbac',
    icon: 'pi pi-shield',
    title: 'RBAC framework',
    description: 'Role-aware permissions across portals and navigation.',
  },
  {
    id: 'theme',
    icon: 'pi pi-palette',
    title: 'Theme engine',
    description: 'White-label theming with light, dark, and organization brands.',
  },
];

export const ABOUT_TECH_STACK: readonly TechStackItem[] = [
  { id: 'angular', name: 'Angular 20', category: 'Frontend' },
  { id: 'typescript', name: 'TypeScript', category: 'Language' },
  { id: 'supabase', name: 'Supabase', category: 'Backend' },
  { id: 'primeng', name: 'PrimeNG', category: 'UI' },
  { id: 'scss', name: 'Design Tokens + SCSS', category: 'Styling' },
  { id: 'signals', name: 'Signals Architecture', category: 'State' },
];

export const ABOUT_ROADMAP: readonly RoadmapItem[] = [
  { id: 'r1', quarter: 'Q3 2025', title: 'Business module foundations', status: 'in-progress' },
  { id: 'r2', quarter: 'Q4 2025', title: 'Builder portal expansion', status: 'planned' },
  { id: 'r3', quarter: 'Q1 2026', title: 'Investor reporting suite', status: 'planned' },
  { id: 'r4', quarter: 'Q2 2026', title: 'Marketplace partnerships', status: 'planned' },
];

export const ABOUT_FINAL_CTA = {
  title: 'See the platform in action',
  description: 'Discover how MyPropertyAsset brings clarity to property operations at enterprise scale.',
  primaryCta: {
    label: 'Request a demo',
    route: '/contact',
    analyticsName: 'about_final_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'View pricing',
    route: '/pricing',
    analyticsName: 'about_pricing_cta',
  },
} as const;
