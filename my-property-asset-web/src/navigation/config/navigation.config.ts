import { NavigationConfiguration, NavigationMetadata, NavigationSection } from '../models';

const PUBLIC_SECTIONS = {
  trustedBy: 'trusted-by',
  features: 'features',
  benefits: 'benefits',
  howItWorks: 'how-it-works',
  statistics: 'statistics',
  testimonials: 'testimonials',
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
  // Kept deliberately minimal (UI-001): only Home/Solutions/Pricing/Company render in the header's
  // primary nav. Features/About/Contact/Help/FAQ/How it works/Stories are unchanged, still fully
  // routable pages, and still linked from the footer — only removed from this rendered array.
  topNav: section('public-website-top', 'Primary navigation', [
    { id: 'pub-home', label: 'Home', route: '/', icon: 'pi pi-home', metadata: { analyticsName: 'public_nav_home' } },
    {
      id: 'pub-benefits',
      label: 'Solutions',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.benefits, analyticsName: 'public_nav_benefits' },
    },
    {
      id: 'pub-pricing',
      label: 'Pricing',
      route: '/pricing',
      metadata: { analyticsName: 'public_nav_pricing' },
    },
    {
      id: 'pub-company',
      label: 'Company',
      route: '/company',
      metadata: { analyticsName: 'public_nav_company' },
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
      route: '/pricing',
    },
    {
      id: 'pub-footer-benefits',
      label: 'Solutions',
      route: '/',
      metadata: { fragment: PUBLIC_SECTIONS.benefits },
    },
  ]),
  userNav: emptySection('public-website-user', 'User navigation'),
  quickActions: section('public-website-quick-actions', 'Quick actions', [
    {
      id: 'pub-demo',
      label: 'Request Demo',
      route: '/get-started',
      metadata: { analyticsName: 'public_nav_get_started' },
    },
    {
      id: 'pub-signin',
      label: 'Sign in',
      route: '/auth/login',
      metadata: { analyticsName: 'public_nav_signin' },
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
    id: 'sa-organizations',
    label: 'Organizations',
    route: '/super-admin/organizations',
    icon: 'pi pi-sitemap',
    metadata: {
      permissions: ['id-03-organization-tenancy:read'],
      analyticsName: 'sa_organizations_nav',
    },
  },
  {
    id: 'sa-builders',
    label: 'Builders',
    route: '/super-admin/builders',
    icon: 'pi pi-building',
    metadata: {
      permissions: ['id-02-builder-onboarding:read'],
      analyticsName: 'sa_builders_nav',
    },
  },
  {
    id: 'sa-iam',
    label: 'Identity & Access',
    route: '/super-admin/iam/users',
    icon: 'pi pi-users',
    metadata: {
      permissions: ['id-14-user-identity-access:read'],
      analyticsName: 'sa_iam_nav',
    },
  },
  {
    id: 'sa-branding',
    label: 'Branding',
    route: '/super-admin/branding',
    icon: 'pi pi-palette',
    metadata: {
      permissions: ['id-04-white-label-branding:read'],
      analyticsName: 'sa_branding_nav',
    },
  },
  {
    id: 'sa-platform',
    label: 'Platform Settings',
    route: '/super-admin/settings',
    icon: 'pi pi-cog',
    metadata: {
      permissions: ['id-06-platform-operations:read'],
      analyticsName: 'sa_settings_nav',
    },
  },
  {
    id: 'sa-operations',
    label: 'Operations',
    route: '/super-admin/operations',
    icon: 'pi pi-chart-line',
    metadata: {
      permissions: ['id-06-platform-operations:read'],
      analyticsName: 'sa_operations_nav',
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
        permissions: ['portal:builder-portal'],
        analyticsName: 'ba_dashboard_nav',
      },
    },
    {
      id: 'ba-company',
      label: 'Company',
      route: '/builder-portal/company',
      icon: 'pi pi-building',
      metadata: {
        permissions: ['portal:builder-portal', 'id-03-organization-tenancy:read'],
        analyticsName: 'ba_company_nav',
      },
    },
    {
      id: 'ba-branding',
      label: 'Branding',
      route: '/builder-portal/branding',
      icon: 'pi pi-palette',
      metadata: {
        permissions: ['id-04-white-label-branding:read'],
        analyticsName: 'ba_branding_nav',
      },
    },
    {
      id: 'ba-projects',
      label: 'Projects',
      route: '/builder-portal/projects',
      icon: 'pi pi-briefcase',
      metadata: {
        permissions: ['id-07-project-unit:read'],
        analyticsName: 'ba_projects_nav',
      },
    },
    {
      id: 'ba-owners',
      label: 'Owners',
      route: '/builder-portal/owners',
      icon: 'pi pi-users',
      metadata: {
        permissions: ['id-08-owner-assignment-prospect:read'],
        analyticsName: 'ba_owners_nav',
      },
    },
    {
      id: 'ba-documents',
      label: 'Documents',
      route: '/builder-portal/documents',
      icon: 'pi pi-file',
      metadata: {
        permissions: ['id-09-handover-document:read'],
        analyticsName: 'ba_documents_nav',
      },
    },
    {
      id: 'ba-handovers',
      label: 'Handovers',
      route: '/builder-portal/handovers',
      icon: 'pi pi-flag',
      metadata: {
        permissions: ['id-09-handover-document:read'],
        analyticsName: 'ba_handovers_nav',
      },
    },
    {
      id: 'ba-settings',
      label: 'Settings',
      route: '/builder-portal/settings',
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
