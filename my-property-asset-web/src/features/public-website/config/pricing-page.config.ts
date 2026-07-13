import { PublicCtaAction, PublicFaqItem } from '../models/public-section.model';
import {
  PricingComparisonFeature,
  PricingEnterpriseOffer,
  PricingPlan,
  PricingTrustHighlight,
} from '../models/pricing.model';

export const PRICING_PAGE_HERO = {
  eyebrow: 'Transparent pricing',
  title: 'Plans that scale with your portfolio',
  subtitle:
    'Start free, grow with confidence, and unlock enterprise governance when your organization is ready. No payment processing on this page — choose a plan and get started.',
  primaryCta: {
    label: 'Start free trial',
    route: '/auth/login',
    analyticsName: 'pricing_hero_cta',
  } satisfies PublicCtaAction,
} as const;

export const PRICING_ANNUAL_DISCOUNT_PERCENT = 20;

export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Explore the platform and validate fit for your team.',
    prices: { monthly: 0, annual: 0, currency: 'USD' },
    features: [
      '1 organization workspace',
      'Up to 3 team members',
      'Core portfolio views',
      'Community support',
    ],
    ctaLabel: 'Get started free',
    ctaRoute: '/auth/login',
    ctaAnalyticsName: 'pricing_plan_free',
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For growing builders establishing operational excellence.',
    prices: { monthly: 149, annual: 119, currency: 'USD' },
    features: [
      'Everything in Free',
      'Up to 25 team members',
      'Organization branding',
      'Role-based access control',
      'Email support',
    ],
    ctaLabel: 'Start Starter trial',
    ctaRoute: '/auth/login',
    ctaAnalyticsName: 'pricing_plan_starter',
    badge: 'Popular',
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For established operators managing multiple developments.',
    prices: { monthly: 399, annual: 319, currency: 'USD' },
    features: [
      'Everything in Starter',
      'Unlimited team members',
      'Multi-organization support',
      'Advanced governance',
      'Priority support',
      'Custom reporting foundations',
    ],
    ctaLabel: 'Start Professional trial',
    ctaRoute: '/auth/login',
    ctaAnalyticsName: 'pricing_plan_professional',
    recommended: true,
    badge: 'Recommended',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For portfolios requiring scale, compliance, and dedicated partnership.',
    prices: { monthly: null, annual: null, currency: 'USD', customLabel: 'Custom' },
    features: [
      'Everything in Professional',
      'Dedicated success manager',
      'Custom SLAs & security reviews',
      'SSO & advanced compliance',
      'White-label marketplace readiness',
      'Implementation support',
    ],
    ctaLabel: 'Contact sales',
    ctaRoute: '/auth/login',
    ctaAnalyticsName: 'pricing_plan_enterprise',
  },
];

export const PRICING_COMPARISON_FEATURES: readonly PricingComparisonFeature[] = [
  {
    id: 'orgs',
    name: 'Organizations',
    category: 'Platform',
    availability: { free: '1', starter: '1', professional: '5', enterprise: 'Unlimited' },
  },
  {
    id: 'members',
    name: 'Team members',
    category: 'Platform',
    availability: { free: '3', starter: '25', professional: 'Unlimited', enterprise: 'Unlimited' },
  },
  {
    id: 'branding',
    name: 'White-label branding',
    category: 'Platform',
    availability: { free: false, starter: true, professional: true, enterprise: true },
  },
  {
    id: 'rbac',
    name: 'Role-based access control',
    category: 'Security',
    availability: { free: 'Basic', starter: true, professional: true, enterprise: true },
  },
  {
    id: 'multi-org',
    name: 'Multi-organization context',
    category: 'Security',
    availability: { free: false, starter: false, professional: true, enterprise: true },
  },
  {
    id: 'audit',
    name: 'Audit-ready workflows',
    category: 'Security',
    availability: { free: false, starter: false, professional: true, enterprise: true },
  },
  {
    id: 'sso',
    name: 'Single sign-on (SSO)',
    category: 'Security',
    availability: { free: false, starter: false, professional: false, enterprise: true },
  },
  {
    id: 'support',
    name: 'Support level',
    category: 'Support',
    availability: { free: 'Community', starter: 'Email', professional: 'Priority', enterprise: 'Dedicated' },
  },
  {
    id: 'sla',
    name: 'Uptime SLA',
    category: 'Support',
    availability: { free: false, starter: false, professional: '99.9%', enterprise: 'Custom' },
  },
  {
    id: 'onboarding',
    name: 'Guided onboarding',
    category: 'Support',
    availability: { free: false, starter: true, professional: true, enterprise: 'White-glove' },
  },
];

export const PRICING_FAQ: readonly PublicFaqItem[] = [
  {
    id: 'pricing-faq-1',
    question: 'Can I switch plans later?',
    answer:
      'Yes. You can upgrade or downgrade as your portfolio grows. Plan changes are designed to be seamless — no reimplementation required.',
  },
  {
    id: 'pricing-faq-2',
    question: 'Is there a free trial?',
    answer:
      'Starter and Professional include a 14-day trial. The Free plan lets you explore core capabilities with no time limit.',
  },
  {
    id: 'pricing-faq-3',
    question: 'How does annual billing work?',
    answer:
      'Annual billing applies a 20% discount compared to monthly pricing. You are billed once per year for the selected plan.',
  },
  {
    id: 'pricing-faq-4',
    question: 'What is included in Enterprise?',
    answer:
      'Enterprise includes custom SLAs, dedicated success, advanced security reviews, SSO, and implementation support tailored to your organization.',
  },
  {
    id: 'pricing-faq-5',
    question: 'Do you process payments on this page?',
    answer:
      'No. This pricing page is informational. Checkout and subscription management will be introduced in a future release.',
  },
];

export const PRICING_ENTERPRISE_OFFER: PricingEnterpriseOffer = {
  title: 'Need a tailored enterprise solution?',
  description:
    'For large portfolios, regulated environments, and multi-brand operators — we partner with you on security, scale, and rollout.',
  highlights: [
    'Custom contracts and procurement support',
    'Security questionnaires and compliance reviews',
    'Dedicated implementation and training',
    'Partner and marketplace extensions',
  ],
  ctaLabel: 'Contact sales',
  ctaRoute: '/auth/login',
  ctaAnalyticsName: 'pricing_enterprise_cta',
};

export const PRICING_TRUST_HIGHLIGHTS: readonly PricingTrustHighlight[] = [
  {
    id: 'security',
    icon: 'pi pi-shield',
    title: 'Enterprise-grade security',
    description: 'Authentication, RBAC, and organization isolation are foundational — not add-ons.',
  },
  {
    id: 'support',
    icon: 'pi pi-headphones',
    title: 'Human support when it matters',
    description: 'From email to dedicated success — support scales with your plan.',
  },
  {
    id: 'guarantee',
    icon: 'pi pi-refresh',
    title: '30-day satisfaction promise',
    description: 'Placeholder policy — full money-back terms will be published before checkout launches.',
  },
];

export const PRICING_FINAL_CTA = {
  title: 'Start building on MyPropertyAsset today',
  description:
    'Choose the plan that fits your portfolio today. Upgrade as you grow — without changing platforms.',
  primaryCta: {
    label: 'Create free account',
    route: '/auth/login',
    analyticsName: 'pricing_final_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'Talk to sales',
    route: '/auth/login',
    analyticsName: 'pricing_sales_cta',
  },
} as const;

export const PRICING_SECTION_IDS = {
  plans: 'plans',
  comparison: 'comparison',
  faq: 'pricing-faq',
  enterprise: 'enterprise',
  trust: 'trust',
} as const;
