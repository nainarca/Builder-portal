import { NavigationConfiguration, NavigationMetadata, NavigationSection } from '../models';

const PUBLIC_SECTIONS = {
  features: 'features',
  pricing: 'pricing',
  faq: 'faq',
  contact: 'contact',
} as const;

const emptySection = (id: string, ariaLabel: string): NavigationSection => ({
  id,
  ariaLabel,
  groups: [],
});

const section = (
  id: string,
  ariaLabel: string,
  items: NavigationSection['groups'][number]['items'],
): NavigationSection => ({
  id,
  ariaLabel,
  groups: [{ id: `${id}-primary`, items }],
});

const createConfiguration = (
  context: NavigationConfiguration['context'],
  sidebarItems: NavigationSection['groups'][number]['items'] = [],
): NavigationConfiguration => ({
  context,
  topNav: emptySection(`${context}-top`, 'Top navigation'),
  sidebarNav: section(`${context}-sidebar`, 'Sidebar navigation', sidebarItems),
  contextNav: emptySection(`${context}-context`, 'Context navigation'),
  secondaryNav: emptySection(`${context}-secondary`, 'Secondary navigation'),
  footerNav: emptySection(`${context}-footer`, 'Footer navigation'),
  userNav: emptySection(`${context}-user`, 'User navigation'),
  quickActions: emptySection(`${context}-quick-actions`, 'Quick actions'),
  favorites: emptySection(`${context}-favorites`, 'Favorites'),
  recentItems: emptySection(`${context}-recent-items`, 'Recent items'),
});

export const NAVIGATION_METADATA: NavigationMetadata = {
  context: 'public-website',
  version: '1.0.0',
  homeRoute: '/',
  showHomeBreadcrumb: true,
};

export const PUBLIC_WEBSITE_NAVIGATION: NavigationConfiguration = {
  context: 'public-website',
  topNav: section('public-website-top', 'Primary navigation', [
    { id: 'pub-home', label: 'Home', route: '/', icon: 'pi pi-home', metadata: { analyticsName: 'public_nav_home' } },
    {
      id: 'pub-features',
      label: 'Features',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.features, analyticsName: 'public_nav_features' },
    },
    {
      id: 'pub-pricing',
      label: 'Pricing',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.pricing, analyticsName: 'public_nav_pricing' },
    },
    {
      id: 'pub-faq',
      label: 'FAQ',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.faq, analyticsName: 'public_nav_faq' },
    },
    {
      id: 'pub-contact',
      label: 'Contact',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.contact, analyticsName: 'public_nav_contact' },
    },
  ]),
  sidebarNav: emptySection('public-website-sidebar', 'Sidebar navigation'),
  contextNav: emptySection('public-website-context', 'Context navigation'),
  secondaryNav: emptySection('public-website-secondary', 'Secondary navigation'),
  footerNav: section('public-website-footer', 'Footer navigation', [
    {
      id: 'pub-footer-features',
      label: 'Features',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.features },
    },
    {
      id: 'pub-footer-pricing',
      label: 'Pricing',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.pricing },
    },
    {
      id: 'pub-footer-faq',
      label: 'FAQ',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.faq },
    },
    {
      id: 'pub-footer-contact',
      label: 'Contact',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.contact },
    },
    { id: 'pub-footer-sign-in', label: 'Sign in', route: '/auth/login' },
  ]),
  userNav: emptySection('public-website-user', 'User navigation'),
  quickActions: section('public-website-quick-actions', 'Quick actions', [
    {
      id: 'pub-demo',
      label: 'Request demo',
      route: '/auth/login',
      metadata: { analyticsName: 'public_nav_demo' },
    },
  ]),
  favorites: emptySection('public-website-favorites', 'Favorites'),
  recentItems: emptySection('public-website-recent-items', 'Recent items'),
};

export const AUTHENTICATION_NAVIGATION: NavigationConfiguration =
  createConfiguration('authentication');

export const SUPER_ADMIN_NAVIGATION: NavigationConfiguration = createConfiguration('super-admin', [
  {
    id: 'sa-dashboard',
    label: 'Dashboard',
    route: '/super-admin',
    icon: 'pi pi-chart-bar',
    metadata: {
      permissions: ['portal:super-admin', 'id-06-platform-operations:read'],
      analyticsName: 'sa_dashboard_nav',
    },
  },
  {
    id: 'sa-builders',
    label: 'Builders',
    route: '/super-admin',
    icon: 'pi pi-building',
    metadata: {
      permissions: ['id-02-builder-onboarding:read'],
      analyticsName: 'sa_builders_nav',
    },
  },
  {
    id: 'sa-platform',
    label: 'Platform Operations',
    route: '/super-admin',
    icon: 'pi pi-cog',
    metadata: {
      permissions: ['id-06-platform-operations:full'],
      analyticsName: 'sa_platform_nav',
    },
  },
]);

export const BUILDER_PORTAL_NAVIGATION: NavigationConfiguration = createConfiguration(
  'builder-portal',
  [
    {
      id: 'ba-dashboard',
      label: 'Dashboard',
      route: '/builder-portal',
      icon: 'pi pi-chart-line',
      metadata: {
        permissions: ['portal:builder-portal', 'id-07-project-unit:read'],
        analyticsName: 'ba_dashboard_nav',
      },
    },
    {
      id: 'ba-projects',
      label: 'Projects',
      route: '/builder-portal',
      icon: 'pi pi-briefcase',
      metadata: {
        permissions: ['id-07-project-unit:read'],
        analyticsName: 'ba_projects_nav',
      },
    },
    {
      id: 'ba-settings',
      label: 'Settings',
      route: '/builder-portal',
      icon: 'pi pi-sliders-h',
      metadata: {
        permissions: ['id-03-organization-tenancy:operate'],
        analyticsName: 'ba_settings_nav',
      },
    },
  ],
);

export const TENANT_PORTAL_NAVIGATION: NavigationConfiguration =
  createConfiguration('tenant-portal');

export const PARTNER_PORTAL_NAVIGATION: NavigationConfiguration =
  createConfiguration('partner-portal');

export const BLANK_NAVIGATION: NavigationConfiguration = createConfiguration('blank');

export const NAVIGATION_CONFIGURATIONS: readonly NavigationConfiguration[] = [
  PUBLIC_WEBSITE_NAVIGATION,
  AUTHENTICATION_NAVIGATION,
  SUPER_ADMIN_NAVIGATION,
  BUILDER_PORTAL_NAVIGATION,
  TENANT_PORTAL_NAVIGATION,
  PARTNER_PORTAL_NAVIGATION,
  BLANK_NAVIGATION,
];
