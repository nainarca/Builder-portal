import { PublicCtaAction } from '../models/public-section.model';
import { HelpArticle, HelpCategory, SupportPageHero } from '../models/support.model';

export const HELP_PAGE_HERO: SupportPageHero = {
  eyebrow: 'Help Center',
  title: 'How can we help you?',
  subtitle:
    'Guides, tutorials, and answers to help you evaluate, onboard, and operate MyPropertyAsset with confidence.',
  primaryCta: {
    label: 'Contact support',
    route: '/contact',
    analyticsName: 'help_hero_contact_cta',
  },
  secondaryCta: {
    label: 'Browse FAQ',
    route: '/faq',
    analyticsName: 'help_hero_faq_cta',
  },
};

export const HELP_CATEGORIES: readonly HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    description: 'Platform overview, onboarding, and first steps for new organizations.',
    icon: 'pi pi-play',
    articleCount: 4,
  },
  {
    id: 'account',
    title: 'Account & access',
    description: 'Sign-in, sessions, organization context, and user management.',
    icon: 'pi pi-user',
    articleCount: 3,
  },
  {
    id: 'security',
    title: 'Security & privacy',
    description: 'Authentication, RBAC, data isolation, and compliance practices.',
    icon: 'pi pi-shield',
    articleCount: 3,
  },
  {
    id: 'billing',
    title: 'Billing & plans',
    description: 'Subscriptions, invoices, plan changes, and enterprise agreements.',
    icon: 'pi pi-credit-card',
    articleCount: 2,
  },
  {
    id: 'technical',
    title: 'Technical',
    description: 'Browser requirements, integrations framework, and troubleshooting.',
    icon: 'pi pi-cog',
    articleCount: 2,
  },
  {
    id: 'white-label',
    title: 'White-label & branding',
    description: 'Theme engine, organization branding, and portal customization.',
    icon: 'pi pi-palette',
    articleCount: 2,
  },
];

export const HELP_ARTICLES: readonly HelpArticle[] = [
  {
    id: 'a1',
    slug: 'platform-overview',
    title: 'MyPropertyAsset platform overview',
    excerpt:
      'Understand the core pillars of MyPropertyAsset — authentication, organization context, RBAC, and white-label theming.',
    categoryId: 'getting-started',
    readTime: '5 min read',
    featured: true,
    popular: true,
    relatedSlugs: ['organization-context', 'security-foundation'],
    sections: [
      {
        id: 's1',
        heading: 'What is MyPropertyAsset?',
        level: 2,
        paragraphs: [
          'MyPropertyAsset is an enterprise property asset management platform designed for builders, owners, managers, and investors. It provides a governed, multi-tenant foundation with premium user experiences across public and authenticated portals.',
          'The platform is built in phases: foundation capabilities (authentication, organization context, RBAC, theming) precede business modules such as projects, units, and portfolio reporting.',
        ],
      },
      {
        id: 's2',
        heading: 'Core platform pillars',
        level: 2,
        paragraphs: [
          'Every MyPropertyAsset deployment is anchored on four pillars that enterprise customers expect before operational data enters the system.',
        ],
      },
      {
        id: 's3',
        heading: 'Authentication & sessions',
        level: 3,
        paragraphs: [
          'Secure sign-in, session lifecycle management, and token handling provide the entry point for all users. Sessions respect organization context and portal permissions.',
        ],
      },
      {
        id: 's4',
        heading: 'Organization context',
        level: 3,
        paragraphs: [
          'Multi-tenant isolation ensures each organization operates within strict boundaries. Users can switch organization context where permitted, with branding applied per tenant.',
        ],
      },
      {
        id: 's5',
        heading: 'Next steps',
        level: 2,
        paragraphs: [
          'Review our pricing plans, explore the About page for company background, or contact sales for an enterprise evaluation and guided demo.',
        ],
      },
    ],
  },
  {
    id: 'a2',
    slug: 'organization-context',
    title: 'Understanding organization context',
    excerpt:
      'Learn how multi-tenant organization switching, branding, and isolation work across MyPropertyAsset portals.',
    categoryId: 'getting-started',
    readTime: '4 min read',
    popular: true,
    relatedSlugs: ['platform-overview', 'rbac-permissions'],
    sections: [
      {
        id: 's1',
        heading: 'Organization context explained',
        level: 2,
        paragraphs: [
          'Organization context determines which tenant data, branding, and permissions apply to the current session. It is the foundation of multi-tenant governance on MyPropertyAsset.',
        ],
      },
      {
        id: 's2',
        heading: 'Switching organizations',
        level: 2,
        paragraphs: [
          'Users with access to multiple organizations can switch context through the organization selector. Each switch refreshes navigation, theme, and permission scope for the selected tenant.',
        ],
      },
    ],
  },
  {
    id: 'a3',
    slug: 'security-foundation',
    title: 'Security foundation overview',
    excerpt:
      'How MyPropertyAsset approaches authentication, RBAC, and organization isolation before business data access.',
    categoryId: 'security',
    readTime: '6 min read',
    featured: true,
    relatedSlugs: ['platform-overview', 'rbac-permissions'],
    sections: [
      {
        id: 's1',
        heading: 'Security by design',
        level: 2,
        paragraphs: [
          'MyPropertyAsset treats security as a platform pillar, not an add-on. Authentication, authorization, and tenant isolation are implemented before business modules expose operational data.',
        ],
      },
      {
        id: 's2',
        heading: 'RBAC framework',
        level: 2,
        paragraphs: [
          'Role-based access control governs portal entry, navigation visibility, and future module permissions. Roles are scoped to organization context and portal type.',
        ],
      },
    ],
  },
  {
    id: 'a4',
    slug: 'rbac-permissions',
    title: 'RBAC and permissions model',
    excerpt: 'Overview of roles, permissions, and portal access across MyPropertyAsset.',
    categoryId: 'account',
    readTime: '4 min read',
    relatedSlugs: ['security-foundation', 'organization-context'],
    sections: [
      {
        id: 's1',
        heading: 'Roles and portals',
        level: 2,
        paragraphs: [
          'MyPropertyAsset supports distinct portals (builder, tenant, partner, super-admin) with role assignments that control navigation and future data access. Permissions follow a structured naming convention for consistency and auditability.',
        ],
      },
    ],
  },
  {
    id: 'a5',
    slug: 'white-label-theming',
    title: 'White-label theming guide',
    excerpt: 'Configure organization branding, light/dark modes, and theme tokens for your portals.',
    categoryId: 'white-label',
    readTime: '5 min read',
    featured: true,
    relatedSlugs: ['platform-overview'],
    sections: [
      {
        id: 's1',
        heading: 'Theme engine',
        level: 2,
        paragraphs: [
          'The MyPropertyAsset theme engine applies design tokens at runtime. Organizations can override brand colors, logos, and surface treatments while maintaining accessibility and component consistency.',
        ],
      },
    ],
  },
  {
    id: 'a6',
    slug: 'plan-comparison-guide',
    title: 'Choosing the right plan',
    excerpt: 'Compare Free, Starter, Professional, and Enterprise plans for your portfolio needs.',
    categoryId: 'billing',
    readTime: '3 min read',
    popular: true,
    relatedSlugs: ['platform-overview'],
    sections: [
      {
        id: 's1',
        heading: 'Plan tiers',
        level: 2,
        paragraphs: [
          'MyPropertyAsset offers tiered plans from evaluation (Free) through enterprise scale. Visit the pricing page for feature comparison, or contact sales for custom enterprise agreements.',
        ],
      },
    ],
  },
];

export const HELP_POPULAR_TOPICS = HELP_ARTICLES.filter((a) => a.popular);
export const HELP_FEATURED_ARTICLES = HELP_ARTICLES.filter((a) => a.featured);

export const HELP_SUPPORT_CTA = {
  title: 'Still need help?',
  description: 'Our team can assist with evaluations, onboarding questions, and enterprise requirements.',
  primaryCta: {
    label: 'Contact support',
    route: '/contact',
    analyticsName: 'help_support_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'View FAQ',
    route: '/faq',
    analyticsName: 'help_faq_cta',
  },
} as const;

export function findHelpArticleBySlug(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categoryId: string): readonly HelpArticle[] {
  return HELP_ARTICLES.filter((article) => article.categoryId === categoryId);
}
