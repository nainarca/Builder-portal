import { PublicCtaAction, PublicFaqItem } from '../models/public-section.model';
import {
  BusinessHours,
  ContactChannel,
  ContactDepartment,
  OfficeLocation,
  PageHeroContent,
} from '../models/company.model';

export const CONTACT_PAGE_HERO: PageHeroContent = {
  eyebrow: 'Contact',
  title: 'Let us help you evaluate MyPropertyAsset',
  subtitle:
    'Whether you are exploring the platform, planning an enterprise rollout, or need support — our team is ready to connect.',
  primaryCta: {
    label: 'Send a message',
    route: '/contact',
    fragment: 'contact-form',
    analyticsName: 'contact_hero_cta',
  },
};

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: 'email',
    icon: 'pi pi-envelope',
    label: 'General inquiries',
    value: 'hello@mypropertyasset.com',
    href: 'mailto:hello@mypropertyasset.com',
  },
  {
    id: 'phone',
    icon: 'pi pi-phone',
    label: 'Sales line',
    value: '+1 (800) 555-0199',
    href: 'tel:+18005550199',
    hint: 'Mon–Fri, 9am–6pm EST',
  },
  {
    id: 'support',
    icon: 'pi pi-headphones',
    label: 'Support',
    value: 'support@mypropertyasset.com',
    href: 'mailto:support@mypropertyasset.com',
  },
];

export const CONTACT_BUSINESS_HOURS: BusinessHours = {
  weekdays: 'Monday – Friday, 9:00 AM – 6:00 PM',
  weekends: 'Saturday – Sunday, Closed',
  timezone: 'Eastern Time (ET)',
};

export const CONTACT_OFFICES: readonly OfficeLocation[] = [
  {
    id: 'hq',
    city: 'New York',
    region: 'United States',
    address: '100 Enterprise Plaza, Suite 2400\nNew York, NY 10001',
    timezone: 'EST',
    isPrimary: true,
  },
  {
    id: 'emea',
    city: 'London',
    region: 'United Kingdom',
    address: '1 Platform Square, Level 12\nLondon EC2A 4NE',
    timezone: 'GMT',
  },
  {
    id: 'apac',
    city: 'Singapore',
    region: 'Singapore',
    address: '88 Marina View, #30-01\nSingapore 018961',
    timezone: 'SGT',
  },
];

export const CONTACT_DEPARTMENTS: readonly ContactDepartment[] = [
  {
    id: 'sales',
    title: 'Sales',
    description: 'Demos, pricing, and enterprise evaluations.',
    email: 'sales@mypropertyasset.com',
    phone: '+1 (800) 555-0101',
    ctaLabel: 'Email sales',
  },
  {
    id: 'support',
    title: 'Customer support',
    description: 'Help with your account, onboarding, and platform questions.',
    email: 'support@mypropertyasset.com',
    ctaLabel: 'Email support',
  },
];

export const CONTACT_FAQ_LINKS: readonly (PublicFaqItem & { route: string; fragment?: string })[] = [
  {
    id: 'cf1',
    question: 'How do I request a demo?',
    answer: 'Use the contact form or email sales@mypropertyasset.com.',
    route: '/pricing',
  },
  {
    id: 'cf2',
    question: 'What plans are available?',
    answer: 'Compare Free, Starter, Professional, and Enterprise on our pricing page.',
    route: '/pricing',
  },
  {
    id: 'cf3',
    question: 'Where can I learn about the company?',
    answer: 'Visit our About and Company pages for our story, team, and milestones.',
    route: '/about',
  },
];

export const CONTACT_MAP_PLACEHOLDER = {
  title: 'Global presence',
  description: 'Interactive map integration will be available in a future release. Offices listed below represent our primary locations.',
};

export const CONTACT_FINAL_CTA = {
  title: 'Prefer to explore first?',
  description: 'Review our pricing plans or learn more about the platform before reaching out.',
  primaryCta: {
    label: 'View pricing',
    route: '/pricing',
    analyticsName: 'contact_pricing_cta',
  } satisfies PublicCtaAction,
  secondaryCta: {
    label: 'About us',
    route: '/about',
    analyticsName: 'contact_about_cta',
  },
} as const;
