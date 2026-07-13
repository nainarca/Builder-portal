import { PublicCtaAction } from '../models/public-section.model';
import { FaqCategory, SupportPageHero } from '../models/support.model';

export const FAQ_PAGE_HERO: SupportPageHero = {
  eyebrow: 'FAQ',
  title: 'Frequently asked questions',
  subtitle:
    'Quick answers about MyPropertyAsset — from getting started to security, billing, and technical requirements.',
  primaryCta: {
    label: 'Visit Help Center',
    route: '/help',
    analyticsName: 'faq_hero_help_cta',
  },
  secondaryCta: {
    label: 'Contact us',
    route: '/contact',
    analyticsName: 'faq_hero_contact_cta',
  },
};

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    id: 'general',
    title: 'General',
    icon: 'pi pi-info-circle',
    description: 'Platform overview, demos, and getting started.',
    items: [
      {
        id: 'g1',
        question: 'What is MyPropertyAsset?',
        answer:
          'MyPropertyAsset is an enterprise property asset management platform for builders, owners, managers, and investors. It unifies portfolios, projects, and stakeholders with governed multi-tenant architecture.',
      },
      {
        id: 'g2',
        question: 'Who is MyPropertyAsset for?',
        answer:
          'Property developers, asset managers, institutional owners, and investor groups that need enterprise-grade visibility, security, and white-label portal experiences.',
      },
      {
        id: 'g3',
        question: 'How do I request a demo?',
        answer:
          'Use the contact form at /contact or email sales@mypropertyasset.com. Our team will schedule an evaluation tailored to your portfolio and requirements.',
      },
      {
        id: 'g4',
        question: 'Is there a free plan?',
        answer:
          'Yes. The Free plan supports evaluation with core platform access. See /pricing for plan comparison and feature details.',
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing',
    icon: 'pi pi-tag',
    description: 'Plans, billing cycles, and enterprise agreements.',
    items: [
      {
        id: 'p1',
        question: 'What plans are available?',
        answer:
          'Free, Starter, Professional, and Enterprise. Compare features and pricing at /pricing. Enterprise plans include custom SLAs and dedicated support.',
      },
      {
        id: 'p2',
        question: 'Can I switch plans later?',
        answer:
          'Yes. Upgrade or downgrade as your portfolio grows. Plan changes take effect at the next billing cycle unless otherwise agreed.',
      },
      {
        id: 'p3',
        question: 'Is annual billing available?',
        answer:
          'Yes. Annual billing offers savings compared to monthly. Toggle billing period on the pricing page to compare.',
      },
      {
        id: 'p4',
        question: 'Do you offer enterprise custom pricing?',
        answer:
          'Enterprise customers receive tailored agreements based on portfolio size, SLA requirements, and deployment scope. Contact sales for a quote.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    icon: 'pi pi-user',
    description: 'Sign-in, sessions, and organization access.',
    items: [
      {
        id: 'ac1',
        question: 'How do I sign in?',
        answer:
          'Navigate to the sign-in page and enter your credentials. Enterprise customers receive organization-specific onboarding instructions.',
      },
      {
        id: 'ac2',
        question: 'Can I belong to multiple organizations?',
        answer:
          'Yes. Users with access to multiple tenants can switch organization context via the organization selector after authentication.',
      },
      {
        id: 'ac3',
        question: 'What happens when my session expires?',
        answer:
          'Expired sessions redirect to the session expired page. Sign in again to restore access. Session duration is configurable for enterprise deployments.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: 'pi pi-shield',
    description: 'Authentication, RBAC, and data protection.',
    items: [
      {
        id: 'se1',
        question: 'How is data isolated between organizations?',
        answer:
          'MyPropertyAsset uses multi-tenant architecture with strict organization context boundaries. Data access is scoped to the authenticated organization.',
      },
      {
        id: 'se2',
        question: 'What authentication methods are supported?',
        answer:
          'The platform foundation supports secure email/password authentication with session management. Enterprise SSO integrations are planned for future releases.',
      },
      {
        id: 'se3',
        question: 'How does RBAC work?',
        answer:
          'Role-based access control governs portal access and navigation. Permissions are assigned per organization and portal type, with audit-ready naming conventions.',
      },
      {
        id: 'se4',
        question: 'Where can I read your security policy?',
        answer: 'Visit /legal/security for our security policy overview and trust practices.',
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: 'pi pi-credit-card',
    description: 'Invoices, payments, and subscription management.',
    items: [
      {
        id: 'b1',
        question: 'What payment methods are accepted?',
        answer:
          'Credit card and invoice billing are available depending on plan tier. Enterprise customers may use purchase orders and custom payment terms.',
      },
      {
        id: 'b2',
        question: 'How do I cancel my subscription?',
        answer:
          'Contact support@mypropertyasset.com or your account manager. Cancellation takes effect at the end of the current billing period.',
      },
      {
        id: 'b3',
        question: 'Are refunds available?',
        answer:
          'Refund policies vary by plan and agreement. Review /legal/terms for standard terms or contact sales for enterprise arrangements.',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical',
    icon: 'pi pi-cog',
    description: 'Browser support, performance, and integrations.',
    items: [
      {
        id: 't1',
        question: 'Which browsers are supported?',
        answer:
          'Latest versions of Chrome, Firefox, Safari, and Edge. The platform is responsive across desktop, tablet, and mobile viewports.',
      },
      {
        id: 't2',
        question: 'Is there an API?',
        answer:
          'API and integration frameworks are on the product roadmap. Contact sales for early access discussions and partner programs.',
      },
      {
        id: 't3',
        question: 'How do I report a technical issue?',
        answer:
          'Email support@mypropertyasset.com with steps to reproduce, browser version, and organization context. Include screenshots where helpful.',
      },
    ],
  },
];

export const FAQ_FEATURED_QUESTIONS = [
  FAQ_CATEGORIES[0].items[0],
  FAQ_CATEGORIES[1].items[0],
  FAQ_CATEGORIES[3].items[0],
  FAQ_CATEGORIES[5].items[0],
];

export const FAQ_ALL_ITEMS = FAQ_CATEGORIES.flatMap((category) => category.items);

export const FAQ_SUPPORT_CTA = {
  title: 'Did not find your answer?',
  description: 'Browse the Help Center for guides or contact our team directly.',
  primaryCta: {
    label: 'Help Center',
    route: '/help',
    analyticsName: 'faq_help_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'Contact support',
    route: '/contact',
    analyticsName: 'faq_contact_cta',
  },
} as const;
