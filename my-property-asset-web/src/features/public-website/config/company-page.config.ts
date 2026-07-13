import { PublicCtaAction, PublicStatisticItem } from '../models/public-section.model';
import {
  AwardItem,
  CustomerSuccessItem,
  LeadershipMember,
  PageHeroContent,
  SecurityHighlight,
  TimelineEvent,
} from '../models/company.model';
import { PublicTrustBadge } from '../models/public-section.model';

export const COMPANY_PAGE_HERO: PageHeroContent = {
  eyebrow: 'Company',
  title: 'An enterprise company built for property',
  subtitle:
    'MyPropertyAsset is a product-led organization focused on trust, craft, and long-term partnerships with builders, owners, and institutional operators.',
  primaryCta: {
    label: 'Contact us',
    route: '/contact',
    analyticsName: 'company_hero_contact_cta',
  },
};

export const COMPANY_OVERVIEW = {
  title: 'Who we are',
  description:
    'We are a team of product engineers, designers, and domain specialists united by a single belief: property asset management deserves world-class software. We partner with enterprises that value governance, brand quality, and operational clarity.',
};

export const COMPANY_LEADERSHIP: readonly LeadershipMember[] = [
  {
    id: 'ceo',
    name: 'Alexandra Reed',
    role: 'Chief Executive Officer',
    bio: 'Former enterprise SaaS leader with 15+ years building platforms for regulated industries.',
    initials: 'AR',
  },
  {
    id: 'cto',
    name: 'David Okonkwo',
    role: 'Chief Technology Officer',
    bio: 'Architect of multi-tenant platforms; passionate about security, performance, and developer experience.',
    initials: 'DO',
  },
  {
    id: 'cpo',
    name: 'Sarah Chen',
    role: 'Chief Product Officer',
    bio: 'Product strategist focused on premium UX for complex enterprise workflows.',
    initials: 'SC',
  },
  {
    id: 'cso',
    name: 'James Whitfield',
    role: 'Chief Security Officer',
    bio: 'Security and compliance leader ensuring enterprise-grade trust across the platform.',
    initials: 'JW',
  },
];

export const COMPANY_STATISTICS: readonly PublicStatisticItem[] = [
  { id: 'team', value: '48+', label: 'Team members', hint: 'Across product, engineering, and success' },
  { id: 'customers', value: '50+', label: 'Organizations', hint: 'Pilot and early adopter programs' },
  { id: 'countries', value: '6', label: 'Countries', hint: 'Remote-first global team' },
  { id: 'uptime', value: '99.9%', label: 'Uptime target', hint: 'Enterprise SLA commitment' },
];

export const COMPANY_MILESTONES: readonly TimelineEvent[] = [
  {
    id: 'm1',
    year: '2022',
    title: 'Company founded',
    description: 'MyPropertyAsset incorporated with a mission to modernize property operations.',
  },
  {
    id: 'm2',
    year: '2023',
    title: 'Platform foundation',
    description: 'Core authentication, organization context, and RBAC frameworks completed.',
  },
  {
    id: 'm3',
    year: '2024',
    title: 'Enterprise pilots',
    description: 'Builder and operator partners onboarded for governed portfolio visibility.',
  },
  {
    id: 'm4',
    year: '2025',
    title: 'Public launch readiness',
    description: 'Marketing website, pricing, and company pages prepared for market.',
  },
];

export const COMPANY_AWARDS: readonly AwardItem[] = [
  {
    id: 'a1',
    title: 'PropTech Innovation',
    organization: 'Industry Excellence Awards',
    year: '2024',
  },
  {
    id: 'a2',
    title: 'Best Enterprise UX',
    organization: 'SaaS Design Summit',
    year: '2024',
  },
  {
    id: 'a3',
    title: 'Security Foundation',
    organization: 'Enterprise Trust Index',
    year: '2025',
  },
];

export const COMPANY_CUSTOMER_SUCCESS: readonly CustomerSuccessItem[] = [
  {
    id: 'cs1',
    metric: '40%',
    label: 'Faster reporting',
    description: 'Average reduction in time to produce operational reports.',
  },
  {
    id: 'cs2',
    metric: '3×',
    label: 'Stakeholder alignment',
    description: 'Improvement in cross-team visibility during pilot programs.',
  },
  {
    id: 'cs3',
    metric: '4.9/5',
    label: 'Experience rating',
    description: 'Satisfaction score from enterprise pilot participants.',
  },
];

export const COMPANY_SECURITY: readonly SecurityHighlight[] = [
  {
    id: 's1',
    icon: 'pi pi-shield',
    title: 'Organization isolation',
    description: 'Multi-tenant architecture with strict organization context boundaries.',
  },
  {
    id: 's2',
    icon: 'pi pi-lock',
    title: 'Authentication foundation',
    description: 'Secure sessions, token lifecycle, and RBAC before business data access.',
  },
  {
    id: 's3',
    icon: 'pi pi-file-check',
    title: 'Privacy by design',
    description: 'Data handling practices aligned with enterprise privacy expectations.',
  },
  {
    id: 's4',
    icon: 'pi pi-verified',
    title: 'Audit readiness',
    description: 'Governance workflows designed for compliance and accountability.',
  },
];

export const COMPANY_TRUST_BADGES: readonly PublicTrustBadge[] = [
  { id: 't1', icon: 'pi pi-shield', label: 'SOC 2 readiness (placeholder)' },
  { id: 't2', icon: 'pi pi-globe', label: 'GDPR-aware architecture' },
  { id: 't3', icon: 'pi pi-server', label: 'Enterprise SLA options' },
];

export const COMPANY_FINAL_CTA = {
  title: 'Partner with a company that understands property',
  description: 'Let us show you how MyPropertyAsset supports enterprise operations from day one.',
  primaryCta: {
    label: 'Get in touch',
    route: '/contact',
    analyticsName: 'company_final_cta',
  } satisfies PublicCtaAction,
};
