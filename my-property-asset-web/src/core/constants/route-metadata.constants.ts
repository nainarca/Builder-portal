import { RouteMetadata } from '../../navigation/models';

export const createRouteMetadata = (metadata: RouteMetadata): RouteMetadata => metadata;

export const PUBLIC_HOME_METADATA: RouteMetadata = {
  title: 'Home',
  icon: 'pi pi-home',
  description: 'MyPropertyAsset enterprise property asset management platform',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Home',
  analyticsName: 'public_home',
  visible: true,
  seo: {
    title: 'MyPropertyAsset — Enterprise Property Asset Management Platform',
    description:
      'MyPropertyAsset unifies portfolios, projects, and stakeholders for property owners, builders, managers, and investors. Enterprise security, white-label portals, and portfolio intelligence in one platform.',
    keywords: [
      'property asset management',
      'enterprise property platform',
      'builder property software',
      'portfolio management SaaS',
      'property investor dashboard',
      'white-label property portal',
    ],
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'organization',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'MyPropertyAsset',
          url: 'https://mypropertyasset.com',
          logo: 'https://mypropertyasset.com/assets/branding/platform/logo.svg',
          description:
            'Enterprise property asset management platform for builders, owners, managers, and investors.',
          sameAs: [
            'https://linkedin.com',
            'https://twitter.com',
          ],
        },
      },
      {
        id: 'website',
        data: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'MyPropertyAsset',
          url: 'https://mypropertyasset.com',
          description:
            'Premium enterprise SaaS platform for property asset management and portfolio operations.',
        },
      },
      {
        id: 'software',
        data: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'MyPropertyAsset',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Contact for enterprise pricing',
          },
        },
      },
    ],
  },
};

export const PUBLIC_PRICING_METADATA: RouteMetadata = {
  title: 'Pricing',
  icon: 'pi pi-tag',
  description: 'MyPropertyAsset pricing plans for property enterprises',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Pricing',
  analyticsName: 'public_pricing',
  visible: true,
  seo: {
    title: 'Pricing — MyPropertyAsset Enterprise Plans',
    description:
      'Compare Free, Starter, Professional, and Enterprise plans. Flexible monthly and annual billing for property owners, builders, managers, and investors.',
    keywords: [
      'property management pricing',
      'enterprise SaaS pricing',
      'builder software plans',
      'property platform cost',
      'portfolio management pricing',
    ],
    canonicalUrl: 'https://mypropertyasset.com/pricing',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'product',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'MyPropertyAsset',
          description: 'Enterprise property asset management platform',
          brand: {
            '@type': 'Brand',
            name: 'MyPropertyAsset',
          },
          offers: [
            {
              '@type': 'Offer',
              name: 'Free',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free plan for evaluation',
            },
            {
              '@type': 'Offer',
              name: 'Starter',
              price: '149',
              priceCurrency: 'USD',
              description: 'Monthly Starter plan',
            },
            {
              '@type': 'Offer',
              name: 'Professional',
              price: '399',
              priceCurrency: 'USD',
              description: 'Monthly Professional plan',
            },
          ],
        },
      },
      {
        id: 'faq',
        data: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Can I switch plans later?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. You can upgrade or downgrade as your portfolio grows.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is there a free trial?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Starter and Professional include a 14-day trial. The Free plan has no time limit.',
              },
            },
          ],
        },
      },
    ],
  },
};

export const PUBLIC_ABOUT_METADATA: RouteMetadata = {
  title: 'About',
  icon: 'pi pi-info-circle',
  description: 'About MyPropertyAsset — our story, mission, and platform vision',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'About',
  analyticsName: 'public_about',
  visible: true,
  seo: {
    title: 'About — MyPropertyAsset Enterprise Property Platform',
    description:
      'Learn how MyPropertyAsset is building the operating system for modern property enterprises — our story, values, journey, and technology foundation.',
    keywords: [
      'about MyPropertyAsset',
      'property technology company',
      'enterprise property SaaS',
      'proptech platform',
      'property operations software',
    ],
    canonicalUrl: 'https://mypropertyasset.com/about',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'about-page',
        data: {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About MyPropertyAsset',
          description:
            'Company story, mission, vision, and platform highlights for MyPropertyAsset enterprise property management.',
          url: 'https://mypropertyasset.com/about',
          isPartOf: {
            '@type': 'WebSite',
            name: 'MyPropertyAsset',
            url: 'https://mypropertyasset.com',
          },
        },
      },
      {
        id: 'organization',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'MyPropertyAsset',
          url: 'https://mypropertyasset.com',
          logo: 'https://mypropertyasset.com/assets/branding/platform/logo.svg',
          description:
            'Enterprise property asset management platform for builders, owners, managers, and investors.',
        },
      },
    ],
  },
};

export const PUBLIC_COMPANY_METADATA: RouteMetadata = {
  title: 'Company',
  icon: 'pi pi-building',
  description: 'MyPropertyAsset company overview, leadership, milestones, and trust indicators',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Company',
  analyticsName: 'public_company',
  visible: true,
  seo: {
    title: 'Company — MyPropertyAsset Leadership & Trust',
    description:
      'Explore MyPropertyAsset as an enterprise company — leadership, milestones, customer success, security practices, and trust indicators.',
    keywords: [
      'MyPropertyAsset company',
      'property SaaS leadership',
      'enterprise proptech',
      'property platform security',
      'company milestones',
    ],
    canonicalUrl: 'https://mypropertyasset.com/company',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'organization',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'MyPropertyAsset',
          url: 'https://mypropertyasset.com',
          logo: 'https://mypropertyasset.com/assets/branding/platform/logo.svg',
          description:
            'Product-led enterprise company building property asset management technology.',
          foundingDate: '2022',
          numberOfEmployees: {
            '@type': 'QuantitativeValue',
            value: '48',
          },
        },
      },
    ],
  },
};

export const PUBLIC_CONTACT_METADATA: RouteMetadata = {
  title: 'Contact',
  icon: 'pi pi-envelope',
  description: 'Contact MyPropertyAsset for sales, support, and enterprise evaluations',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Contact',
  analyticsName: 'public_contact',
  visible: true,
  seo: {
    title: 'Contact — MyPropertyAsset Sales & Support',
    description:
      'Get in touch with MyPropertyAsset for demos, enterprise pricing, and support. Offices in New York, London, and Singapore.',
    keywords: [
      'contact MyPropertyAsset',
      'property platform demo',
      'enterprise sales',
      'property SaaS support',
      'request demo',
    ],
    canonicalUrl: 'https://mypropertyasset.com/contact',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'contact-page',
        data: {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact MyPropertyAsset',
          description: 'Contact sales and support for MyPropertyAsset enterprise evaluations.',
          url: 'https://mypropertyasset.com/contact',
        },
      },
      {
        id: 'organization',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'MyPropertyAsset',
          url: 'https://mypropertyasset.com',
          email: 'hello@mypropertyasset.com',
          telephone: '+1-800-555-0199',
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'sales',
              email: 'sales@mypropertyasset.com',
              telephone: '+1-800-555-0101',
              availableLanguage: 'English',
            },
            {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'support@mypropertyasset.com',
              availableLanguage: 'English',
            },
          ],
        },
      },
      {
        id: 'faq',
        data: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do I request a demo?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Use the contact form or email sales@mypropertyasset.com.',
              },
            },
            {
              '@type': 'Question',
              name: 'What plans are available?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Compare Free, Starter, Professional, and Enterprise on our pricing page.',
              },
            },
          ],
        },
      },
    ],
  },
};

export const PUBLIC_HELP_METADATA: RouteMetadata = {
  title: 'Help Center',
  icon: 'pi pi-question-circle',
  description: 'MyPropertyAsset help center — guides, tutorials, and support resources',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Help Center',
  analyticsName: 'public_help',
  visible: true,
  seo: {
    title: 'Help Center — MyPropertyAsset Support & Guides',
    description:
      'Browse MyPropertyAsset help articles on getting started, security, billing, white-label theming, and technical requirements.',
    keywords: [
      'MyPropertyAsset help',
      'property platform documentation',
      'enterprise SaaS support',
      'getting started guide',
      'platform tutorials',
    ],
    canonicalUrl: 'https://mypropertyasset.com/help',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'help-page',
        data: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'MyPropertyAsset Help Center',
          description: 'Support guides and tutorials for the MyPropertyAsset platform.',
          url: 'https://mypropertyasset.com/help',
        },
      },
    ],
  },
};

export const PUBLIC_HELP_ARTICLE_METADATA: RouteMetadata = {
  title: 'Help Article',
  description: 'MyPropertyAsset help article',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Article',
  analyticsName: 'public_help_article',
  visible: false,
};

export const PUBLIC_FAQ_METADATA: RouteMetadata = {
  title: 'FAQ',
  icon: 'pi pi-comments',
  description: 'Frequently asked questions about MyPropertyAsset',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'FAQ',
  analyticsName: 'public_faq',
  visible: true,
  seo: {
    title: 'FAQ — MyPropertyAsset Frequently Asked Questions',
    description:
      'Answers to common questions about MyPropertyAsset — pricing, accounts, security, billing, and technical requirements.',
    keywords: [
      'MyPropertyAsset FAQ',
      'property platform questions',
      'enterprise SaaS FAQ',
      'pricing questions',
      'security FAQ',
    ],
    canonicalUrl: 'https://mypropertyasset.com/faq',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'faq-page',
        data: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is MyPropertyAsset?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'MyPropertyAsset is an enterprise property asset management platform for builders, owners, managers, and investors.',
              },
            },
            {
              '@type': 'Question',
              name: 'What plans are available?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Free, Starter, Professional, and Enterprise. Compare features at /pricing.',
              },
            },
            {
              '@type': 'Question',
              name: 'How is data isolated between organizations?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'MyPropertyAsset uses multi-tenant architecture with strict organization context boundaries.',
              },
            },
          ],
        },
      },
    ],
  },
};

export const PUBLIC_LEGAL_METADATA: RouteMetadata = {
  title: 'Legal',
  icon: 'pi pi-file',
  description: 'MyPropertyAsset legal policies and compliance information',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Legal',
  analyticsName: 'public_legal',
  visible: true,
  seo: {
    title: 'Legal — MyPropertyAsset Policies & Compliance',
    description:
      'Review MyPropertyAsset privacy policy, terms, cookie policy, security policy, and compliance overview.',
    keywords: [
      'MyPropertyAsset legal',
      'privacy policy',
      'terms and conditions',
      'cookie policy',
      'compliance',
    ],
    canonicalUrl: 'https://mypropertyasset.com/legal',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'legal-hub',
        data: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'MyPropertyAsset Legal',
          description: 'Legal policies and compliance information for MyPropertyAsset.',
          url: 'https://mypropertyasset.com/legal',
        },
      },
    ],
  },
};

export const PUBLIC_LEGAL_DOCUMENT_METADATA: RouteMetadata = {
  title: 'Legal Document',
  description: 'MyPropertyAsset legal document',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Document',
  analyticsName: 'public_legal_document',
  visible: false,
};

export const PUBLIC_GET_STARTED_METADATA: RouteMetadata = {
  title: 'Get Started',
  icon: 'pi pi-arrow-right',
  description: 'Get started with MyPropertyAsset — sign in or explore the platform',
  layout: 'public',
  navigationContext: 'public-website',
  breadcrumb: 'Get Started',
  analyticsName: 'public_get_started',
  visible: true,
  seo: {
    title: 'Get Started — MyPropertyAsset Authentication Entry',
    description:
      'Continue to MyPropertyAsset with a premium authentication entry experience. Sign in, explore trust indicators, and access your governed property workspace.',
    keywords: [
      'get started MyPropertyAsset',
      'sign in property platform',
      'enterprise SaaS login',
      'property management onboarding',
    ],
    canonicalUrl: 'https://mypropertyasset.com/get-started',
    ogType: 'website',
    ogImage: '/assets/branding/platform/og-image.svg',
    twitterCard: 'summary_large_image',
    twitterSite: '@mypropertyasset',
    structuredData: [
      {
        id: 'get-started-page',
        data: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Get Started with MyPropertyAsset',
          description: 'Authentication entry and conversion experience for MyPropertyAsset.',
          url: 'https://mypropertyasset.com/get-started',
        },
      },
    ],
  },
};

export const AUTHENTICATION_METADATA: RouteMetadata = {
  title: 'Authentication',
  icon: 'pi pi-sign-in',
  description: 'Authentication entry point',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Authentication',
  analyticsName: 'authentication_entry',
  visible: true,
};

export const AUTH_LOGIN_METADATA: RouteMetadata = {
  title: 'Sign In',
  icon: 'pi pi-sign-in',
  description: 'Sign in to MyPropertyAsset',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Sign In',
  analyticsName: 'auth_login',
  visible: false,
  seo: {
    title: 'Sign In',
    description: 'Secure sign in for MyPropertyAsset enterprise customers.',
    noIndex: true,
  },
};

export const AUTH_FORGOT_PASSWORD_METADATA: RouteMetadata = {
  title: 'Forgot Password',
  icon: 'pi pi-envelope',
  description: 'Request a password reset link',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Forgot Password',
  analyticsName: 'auth_forgot_password',
  visible: false,
};

export const AUTH_RESET_PASSWORD_METADATA: RouteMetadata = {
  title: 'Reset Password',
  icon: 'pi pi-lock',
  description: 'Choose a new password',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Reset Password',
  analyticsName: 'auth_reset_password',
  visible: false,
};

export const AUTH_ACCESS_DENIED_METADATA: RouteMetadata = {
  title: 'Access Denied',
  icon: 'pi pi-ban',
  description: 'Insufficient permissions',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Access Denied',
  analyticsName: 'auth_access_denied',
  visible: false,
};

export const AUTH_PORTAL_UNAVAILABLE_METADATA: RouteMetadata = {
  title: 'Portal Unavailable',
  icon: 'pi pi-info-circle',
  description: 'This portal is available only for Builder organizations and Platform Administrators.',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Portal Unavailable',
  analyticsName: 'auth_portal_unavailable',
  visible: false,
};

export const AUTH_SESSION_EXPIRED_METADATA: RouteMetadata = {
  title: 'Session Expired',
  icon: 'pi pi-clock',
  description: 'Session has expired',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Session Expired',
  analyticsName: 'auth_session_expired',
  visible: false,
};

export const AUTH_EMAIL_VERIFICATION_METADATA: RouteMetadata = {
  title: 'Verify Email',
  icon: 'pi pi-envelope',
  description: 'Email verification pending',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Verify Email',
  analyticsName: 'auth_email_verification',
  visible: false,
};

export const AUTH_ACCOUNT_LOCKED_METADATA: RouteMetadata = {
  title: 'Account Locked',
  icon: 'pi pi-lock',
  description: 'Account temporarily locked',
  layout: 'public',
  navigationContext: 'authentication',
  breadcrumb: 'Account Locked',
  analyticsName: 'auth_account_locked',
  visible: false,
};

export const SUPER_ADMIN_METADATA: RouteMetadata = {
  title: 'Super Admin',
  icon: 'pi pi-shield',
  description: 'Super Admin portal entry',
  layout: 'super-admin',
  navigationContext: 'super-admin',
  breadcrumb: 'Super Admin',
  organizationContext: true,
  portal: 'portal:super-admin',
  roles: ['super-admin', 'support-user'],
  permissions: ['portal:super-admin', 'id-06-platform-operations:read'],
  analyticsName: 'super_admin_home',
  visible: true,
};

export const SUPER_ADMIN_DASHBOARD_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Dashboard',
  icon: 'pi pi-chart-bar',
  description: 'Executive platform overview and operational signals',
  breadcrumb: 'Dashboard',
  analyticsName: 'super_admin_dashboard',
};

export const SUPER_ADMIN_ORGANIZATIONS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Organizations',
  icon: 'pi pi-sitemap',
  description: 'Manage all platform tenants and organization records',
  breadcrumb: 'Organizations',
  permissions: ['portal:super-admin', 'id-03-organization-tenancy:read'],
  analyticsName: 'super_admin_organizations',
};

export const SUPER_ADMIN_ORGANIZATION_DETAIL_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_ORGANIZATIONS_METADATA,
  title: 'Organization details',
  breadcrumb: 'Details',
  analyticsName: 'super_admin_organization_detail',
};

export const SUPER_ADMIN_ORGANIZATION_CREATE_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_ORGANIZATIONS_METADATA,
  title: 'Create organization',
  breadcrumb: 'Create',
  permissions: ['portal:super-admin', 'id-03-organization-tenancy:operate'],
  analyticsName: 'super_admin_organization_create',
};

export const SUPER_ADMIN_ORGANIZATION_EDIT_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_ORGANIZATIONS_METADATA,
  title: 'Edit organization',
  breadcrumb: 'Edit',
  permissions: ['portal:super-admin', 'id-03-organization-tenancy:operate'],
  analyticsName: 'super_admin_organization_edit',
};

export const SUPER_ADMIN_BUILDERS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Builders',
  icon: 'pi pi-building',
  description: 'Manage builder organizations, onboarding, and platform relationships',
  breadcrumb: 'Builders',
  permissions: ['portal:super-admin', 'id-02-builder-onboarding:read'],
  analyticsName: 'super_admin_builders',
};

export const SUPER_ADMIN_BUILDER_DETAIL_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BUILDERS_METADATA,
  title: 'Builder details',
  breadcrumb: 'Details',
  analyticsName: 'super_admin_builder_detail',
};

export const SUPER_ADMIN_BUILDER_CREATE_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BUILDERS_METADATA,
  title: 'Create builder',
  breadcrumb: 'Create',
  permissions: ['portal:super-admin', 'id-02-builder-onboarding:operate'],
  analyticsName: 'super_admin_builder_create',
};

export const SUPER_ADMIN_BUILDER_EDIT_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BUILDERS_METADATA,
  title: 'Edit builder',
  breadcrumb: 'Edit',
  permissions: ['portal:super-admin', 'id-02-builder-onboarding:operate'],
  analyticsName: 'super_admin_builder_edit',
};

export const SUPER_ADMIN_IAM_USERS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Users',
  icon: 'pi pi-users',
  description: 'Manage platform users, access, and identity records',
  breadcrumb: 'Users',
  permissions: ['portal:super-admin', 'id-14-user-identity-access:read'],
  analyticsName: 'super_admin_iam_users',
};

export const SUPER_ADMIN_IAM_USER_DETAIL_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_IAM_USERS_METADATA,
  title: 'User details',
  breadcrumb: 'Details',
  analyticsName: 'super_admin_iam_user_detail',
};

export const SUPER_ADMIN_IAM_USER_CREATE_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_IAM_USERS_METADATA,
  title: 'Create user',
  breadcrumb: 'Create',
  permissions: ['portal:super-admin', 'id-14-user-identity-access:operate'],
  analyticsName: 'super_admin_iam_user_create',
};

export const SUPER_ADMIN_IAM_USER_EDIT_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_IAM_USERS_METADATA,
  title: 'Edit user',
  breadcrumb: 'Edit',
  permissions: ['portal:super-admin', 'id-14-user-identity-access:operate'],
  analyticsName: 'super_admin_iam_user_edit',
};

export const SUPER_ADMIN_IAM_ROLES_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Roles',
  icon: 'pi pi-shield',
  description: 'System and organization role definitions',
  breadcrumb: 'Roles',
  permissions: ['portal:super-admin', 'id-14-user-identity-access:read'],
  analyticsName: 'super_admin_iam_roles',
};

export const SUPER_ADMIN_IAM_ROLE_DETAIL_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_IAM_ROLES_METADATA,
  title: 'Role details',
  breadcrumb: 'Details',
  analyticsName: 'super_admin_iam_role_detail',
};

export const SUPER_ADMIN_IAM_PERMISSIONS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Permissions',
  icon: 'pi pi-lock',
  description: 'Permission matrix and role comparison',
  breadcrumb: 'Permissions',
  permissions: ['portal:super-admin', 'id-14-user-identity-access:read'],
  analyticsName: 'super_admin_iam_permissions',
};

export const SUPER_ADMIN_IAM_INVITATIONS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Invitations',
  icon: 'pi pi-envelope',
  description: 'User invitation management and tracking',
  breadcrumb: 'Invitations',
  permissions: ['portal:super-admin', 'id-14-user-identity-access:read'],
  analyticsName: 'super_admin_iam_invitations',
};

export const SUPER_ADMIN_BRANDING_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Branding',
  icon: 'pi pi-palette',
  description: 'White-label brand experience center for platform and tenant branding',
  breadcrumb: 'Branding',
  permissions: ['portal:super-admin', 'id-04-white-label-branding:read'],
  analyticsName: 'super_admin_branding',
};

export const SUPER_ADMIN_BRANDING_STUDIO_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BRANDING_METADATA,
  title: 'Brand Studio',
  breadcrumb: 'Studio',
  permissions: ['portal:super-admin', 'id-04-white-label-branding:full'],
  analyticsName: 'super_admin_branding_studio',
};

export const SUPER_ADMIN_SETTINGS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Settings',
  icon: 'pi pi-cog',
  description: 'Platform configuration center for global settings and preferences',
  breadcrumb: 'Settings',
  permissions: ['portal:super-admin', 'id-06-platform-operations:read'],
  analyticsName: 'super_admin_settings',
};

export const SUPER_ADMIN_SETTINGS_GENERAL_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_SETTINGS_METADATA,
  title: 'General Settings',
  breadcrumb: 'General',
  analyticsName: 'super_admin_settings_general',
};

export const SUPER_ADMIN_SETTINGS_SECURITY_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_SETTINGS_METADATA,
  title: 'Security Settings',
  breadcrumb: 'Security',
  analyticsName: 'super_admin_settings_security',
};

export const SUPER_ADMIN_SETTINGS_PLATFORM_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_SETTINGS_METADATA,
  title: 'Platform Configuration',
  breadcrumb: 'Platform',
  analyticsName: 'super_admin_settings_platform',
};

export const SUPER_ADMIN_SETTINGS_NOTIFICATIONS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_SETTINGS_METADATA,
  title: 'Notification Settings',
  breadcrumb: 'Notifications',
  analyticsName: 'super_admin_settings_notifications',
};

export const SUPER_ADMIN_SETTINGS_LOCALIZATION_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_SETTINGS_METADATA,
  title: 'Localization',
  breadcrumb: 'Localization',
  analyticsName: 'super_admin_settings_localization',
};

export const SUPER_ADMIN_SETTINGS_INTEGRATIONS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_SETTINGS_METADATA,
  title: 'Integrations',
  breadcrumb: 'Integrations',
  analyticsName: 'super_admin_settings_integrations',
};

export const SUPER_ADMIN_SETTINGS_PREFERENCES_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_SETTINGS_METADATA,
  title: 'System Preferences',
  breadcrumb: 'Preferences',
  permissions: ['portal:super-admin', 'id-06-platform-operations:full'],
  analyticsName: 'super_admin_settings_preferences',
};

export const SUPER_ADMIN_OPERATIONS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_METADATA,
  title: 'Operations',
  icon: 'pi pi-chart-line',
  description: 'Platform monitoring, audit logs, and system health',
  breadcrumb: 'Operations',
  permissions: ['portal:super-admin', 'id-06-platform-operations:read'],
  analyticsName: 'super_admin_operations',
};

export const SUPER_ADMIN_OPERATIONS_HEALTH_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_OPERATIONS_METADATA,
  title: 'Platform Health',
  breadcrumb: 'Health',
  analyticsName: 'super_admin_operations_health',
};

export const SUPER_ADMIN_OPERATIONS_AUDIT_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_OPERATIONS_METADATA,
  title: 'Audit Logs',
  breadcrumb: 'Audit Logs',
  analyticsName: 'super_admin_operations_audit',
};

export const SUPER_ADMIN_OPERATIONS_AUDIT_DETAIL_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_OPERATIONS_AUDIT_METADATA,
  title: 'Audit Detail',
  breadcrumb: 'Detail',
  analyticsName: 'super_admin_operations_audit_detail',
};

export const SUPER_ADMIN_OPERATIONS_ACTIVITY_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_OPERATIONS_METADATA,
  title: 'User Activity',
  breadcrumb: 'Activity',
  analyticsName: 'super_admin_operations_activity',
};

export const SUPER_ADMIN_OPERATIONS_MONITORING_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_OPERATIONS_METADATA,
  title: 'System Monitoring',
  breadcrumb: 'Monitoring',
  analyticsName: 'super_admin_operations_monitoring',
};

export const SUPER_ADMIN_OPERATIONS_ALERTS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_OPERATIONS_METADATA,
  title: 'Alerts',
  breadcrumb: 'Alerts',
  permissions: ['portal:super-admin', 'id-06-platform-operations:full'],
  analyticsName: 'super_admin_operations_alerts',
};

export const BUILDER_PORTAL_METADATA: RouteMetadata = {
  title: 'Builder Portal',
  icon: 'pi pi-building',
  description: 'Builder Portal entry',
  layout: 'builder-portal',
  navigationContext: 'builder-portal',
  breadcrumb: 'Builder Portal',
  organizationContext: true,
  portal: 'portal:builder-portal',
  roles: ['builder-org-owner', 'builder-org-admin', 'builder-org-member', 'support-user'],
  permissions: ['portal:builder-portal', 'id-07-project-unit:read'],
  analyticsName: 'builder_portal_home',
  visible: true,
};

export const BUILDER_PORTAL_DASHBOARD_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Dashboard',
  icon: 'pi pi-chart-line',
  description: 'Project delivery overview and daily operational signals',
  breadcrumb: 'Dashboard',
  analyticsName: 'builder_portal_dashboard',
};

export const BUILDER_PORTAL_BRANDING_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Branding',
  icon: 'pi pi-palette',
  description: 'Builder white-label identity, theme configuration, and Owner App branding contract',
  breadcrumb: 'Branding',
  permissions: ['portal:builder-portal', 'id-04-white-label-branding:read'],
  analyticsName: 'builder_portal_branding',
};

export const BUILDER_PORTAL_COMMUNICATIONS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Communication Hub',
  icon: 'pi pi-megaphone',
  description: 'Builder-to-owner announcements, updates, reminders, and delivery tracking',
  breadcrumb: 'Communications',
  permissions: ['portal:builder-portal', 'id-11-notification:read'],
  analyticsName: 'builder_portal_communications',
};

export const BUILDER_PORTAL_COMMUNICATION_CREATE_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_COMMUNICATIONS_METADATA,
  title: 'Create communication',
  breadcrumb: 'Create',
  permissions: ['portal:builder-portal', 'id-11-notification:contribute'],
  analyticsName: 'builder_portal_communication_create',
};

export const BUILDER_PORTAL_COMMUNICATION_DETAIL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_COMMUNICATIONS_METADATA,
  title: 'Communication details',
  breadcrumb: 'Details',
  analyticsName: 'builder_portal_communication_detail',
};

export const BUILDER_PORTAL_COMMUNICATION_EDIT_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_COMMUNICATIONS_METADATA,
  title: 'Edit communication',
  breadcrumb: 'Edit',
  permissions: ['portal:builder-portal', 'id-11-notification:contribute'],
  analyticsName: 'builder_portal_communication_edit',
};

export const BUILDER_PORTAL_SUBSCRIPTION_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Subscription',
  icon: 'pi pi-credit-card',
  description: 'Plan limits, usage, renewals, invoices, and upgrades',
  breadcrumb: 'Subscription',
  permissions: ['portal:builder-portal', 'id-05-subscription-commercial:read'],
  analyticsName: 'builder_portal_subscription',
};

export const BUILDER_PORTAL_SUBSCRIPTION_PLANS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_SUBSCRIPTION_METADATA,
  title: 'Plans',
  breadcrumb: 'Plans',
  permissions: ['portal:builder-portal', 'id-05-subscription-commercial:operate'],
  analyticsName: 'builder_portal_subscription_plans',
};

export const BUILDER_PORTAL_SUBSCRIPTION_INVOICES_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_SUBSCRIPTION_METADATA,
  title: 'Invoices',
  breadcrumb: 'Invoices',
  analyticsName: 'builder_portal_subscription_invoices',
};

export const SUPER_ADMIN_BILLING_METADATA: RouteMetadata = {
  title: 'Billing',
  icon: 'pi pi-wallet',
  description: 'Subscription plans, builder billing, invoices, and commercial alerts',
  breadcrumb: 'Billing',
  permissions: ['id-05-subscription-commercial:read'],
  analyticsName: 'super_admin_billing',
};

export const SUPER_ADMIN_BILLING_PLANS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BILLING_METADATA,
  title: 'Plans',
  breadcrumb: 'Plans',
  permissions: ['id-05-subscription-commercial:full'],
  analyticsName: 'super_admin_billing_plans',
};

export const SUPER_ADMIN_BILLING_INVOICES_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BILLING_METADATA,
  title: 'Invoices',
  breadcrumb: 'Invoices',
  analyticsName: 'super_admin_billing_invoices',
};

export const SUPER_ADMIN_BILLING_INVOICE_DETAIL_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BILLING_INVOICES_METADATA,
  title: 'Invoice detail',
  breadcrumb: 'Detail',
  analyticsName: 'super_admin_billing_invoice_detail',
};

export const SUPER_ADMIN_BILLING_LICENSES_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BILLING_METADATA,
  title: 'Licenses',
  breadcrumb: 'Licenses',
  analyticsName: 'super_admin_billing_licenses',
};

export const SUPER_ADMIN_BILLING_USAGE_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BILLING_METADATA,
  title: 'Usage',
  breadcrumb: 'Usage',
  analyticsName: 'super_admin_billing_usage',
};

export const SUPER_ADMIN_BILLING_ALERTS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_BILLING_METADATA,
  title: 'Alerts',
  breadcrumb: 'Alerts',
  analyticsName: 'super_admin_billing_alerts',
};

export const SUPER_ADMIN_COMMUNICATIONS_METADATA: RouteMetadata = {
  ...SUPER_ADMIN_OPERATIONS_METADATA,
  title: 'Communications',
  breadcrumb: 'Communications',
  permissions: ['portal:super-admin', 'id-11-notification:full'],
  analyticsName: 'super_admin_communications',
};

export const BUILDER_PORTAL_PROJECTS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Project workspace',
  icon: 'pi pi-briefcase',
  description: 'Portfolio-wide construction progress, health, and delivery milestones',
  breadcrumb: 'Projects',
  analyticsName: 'builder_portal_projects_workspace',
};

export const BUILDER_PORTAL_PROJECTS_LIST_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_PROJECTS_METADATA,
  title: 'Projects',
  description: 'Search, filter, and manage every development in your portfolio',
  breadcrumb: 'All projects',
  analyticsName: 'builder_portal_projects_list',
};

export const BUILDER_PORTAL_PROJECT_CREATE_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_PROJECTS_METADATA,
  title: 'Create project',
  breadcrumb: 'Create',
  permissions: ['portal:builder-portal', 'id-07-project-unit:contribute'],
  analyticsName: 'builder_portal_project_create',
};

export const BUILDER_PORTAL_PROJECT_DETAIL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_PROJECTS_METADATA,
  title: 'Project details',
  breadcrumb: 'Details',
  analyticsName: 'builder_portal_project_detail',
};

export const BUILDER_PORTAL_PROJECT_EDIT_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_PROJECTS_METADATA,
  title: 'Edit project',
  breadcrumb: 'Edit',
  permissions: ['portal:builder-portal', 'id-07-project-unit:contribute'],
  analyticsName: 'builder_portal_project_edit',
};

export const BUILDER_PORTAL_UNITS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_PROJECTS_METADATA,
  title: 'Units',
  icon: 'pi pi-building',
  description: 'Tower, floor, and construction progress tracking for this project’s units',
  breadcrumb: 'Units',
  analyticsName: 'builder_portal_units_workspace',
};

export const BUILDER_PORTAL_UNIT_CREATE_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_UNITS_METADATA,
  title: 'Create unit',
  breadcrumb: 'Create',
  permissions: ['portal:builder-portal', 'id-07-project-unit:contribute'],
  analyticsName: 'builder_portal_unit_create',
};

export const BUILDER_PORTAL_UNIT_DETAIL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_UNITS_METADATA,
  title: 'Unit details',
  breadcrumb: 'Details',
  analyticsName: 'builder_portal_unit_detail',
};

export const BUILDER_PORTAL_UNIT_EDIT_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_UNITS_METADATA,
  title: 'Edit unit',
  breadcrumb: 'Edit',
  permissions: ['portal:builder-portal', 'id-07-project-unit:contribute'],
  analyticsName: 'builder_portal_unit_edit',
};

export const BUILDER_PORTAL_BUILDINGS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_PROJECTS_METADATA,
  title: 'Buildings',
  icon: 'pi pi-building',
  description: 'Towers and blocks under this project',
  breadcrumb: 'Buildings',
  analyticsName: 'builder_portal_buildings_workspace',
};

export const BUILDER_PORTAL_BUILDING_CREATE_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_BUILDINGS_METADATA,
  title: 'Create building',
  breadcrumb: 'Create',
  permissions: ['portal:builder-portal', 'id-07-project-unit:contribute'],
  analyticsName: 'builder_portal_building_create',
};

export const BUILDER_PORTAL_BUILDING_DETAIL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_BUILDINGS_METADATA,
  title: 'Building details',
  breadcrumb: 'Details',
  analyticsName: 'builder_portal_building_detail',
};

export const BUILDER_PORTAL_BUILDING_EDIT_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_BUILDINGS_METADATA,
  title: 'Edit building',
  breadcrumb: 'Edit',
  permissions: ['portal:builder-portal', 'id-07-project-unit:contribute'],
  analyticsName: 'builder_portal_building_edit',
};

export const BUILDER_PORTAL_OWNERS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Owners',
  icon: 'pi pi-users',
  description: 'Owner assignments, invitations, and customer profiles across every project',
  breadcrumb: 'Owners',
  permissions: ['portal:builder-portal', 'id-08-owner-assignment-prospect:read'],
  analyticsName: 'builder_portal_owners_workspace',
};

export const BUILDER_PORTAL_OWNER_ASSIGN_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_OWNERS_METADATA,
  title: 'Assign owner',
  breadcrumb: 'Assign',
  permissions: ['portal:builder-portal', 'id-08-owner-assignment-prospect:contribute'],
  analyticsName: 'builder_portal_owner_assign',
};

export const BUILDER_PORTAL_OWNER_DETAIL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_OWNERS_METADATA,
  title: 'Owner profile',
  breadcrumb: 'Profile',
  analyticsName: 'builder_portal_owner_detail',
};

export const BUILDER_PORTAL_OWNER_EDIT_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_OWNERS_METADATA,
  title: 'Edit owner',
  breadcrumb: 'Edit',
  permissions: ['portal:builder-portal', 'id-08-owner-assignment-prospect:contribute'],
  analyticsName: 'builder_portal_owner_edit',
};

export const BUILDER_PORTAL_DOCUMENTS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Documents',
  icon: 'pi pi-file',
  description: 'The enterprise document platform — categories, versions, approvals, and visibility',
  breadcrumb: 'Documents',
  permissions: ['portal:builder-portal', 'id-09-handover-document:read'],
  analyticsName: 'builder_portal_documents_workspace',
};

export const BUILDER_PORTAL_DOCUMENT_CATEGORIES_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_DOCUMENTS_METADATA,
  title: 'Document categories',
  breadcrumb: 'Categories',
  analyticsName: 'builder_portal_document_categories',
};

export const BUILDER_PORTAL_DOCUMENT_UPLOAD_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_DOCUMENTS_METADATA,
  title: 'Add document',
  breadcrumb: 'Add document',
  permissions: ['portal:builder-portal', 'id-09-handover-document:contribute'],
  analyticsName: 'builder_portal_document_upload',
};

export const BUILDER_PORTAL_DOCUMENT_DETAIL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_DOCUMENTS_METADATA,
  title: 'Document details',
  breadcrumb: 'Details',
  analyticsName: 'builder_portal_document_detail',
};

export const BUILDER_PORTAL_DOCUMENT_HISTORY_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_DOCUMENTS_METADATA,
  title: 'Version history',
  breadcrumb: 'History',
  analyticsName: 'builder_portal_document_history',
};

export const BUILDER_PORTAL_HANDOVERS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_METADATA,
  title: 'Handovers',
  icon: 'pi pi-flag',
  description: 'The digital property handover workflow — stages, progress, and milestones for every unit',
  breadcrumb: 'Handovers',
  permissions: ['portal:builder-portal', 'id-09-handover-document:read'],
  analyticsName: 'builder_portal_handovers_workspace',
};

export const BUILDER_PORTAL_HANDOVER_DETAIL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVERS_METADATA,
  title: 'Handover details',
  breadcrumb: 'Details',
  analyticsName: 'builder_portal_handover_detail',
};

export const BUILDER_PORTAL_HANDOVER_INSPECTION_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Inspection',
  breadcrumb: 'Inspection',
  analyticsName: 'builder_portal_handover_inspection',
};

export const BUILDER_PORTAL_HANDOVER_CHECKLIST_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Checklist',
  breadcrumb: 'Checklist',
  analyticsName: 'builder_portal_handover_checklist',
};

export const BUILDER_PORTAL_HANDOVER_APPROVAL_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Approval',
  breadcrumb: 'Approval',
  analyticsName: 'builder_portal_handover_approval',
};

export const BUILDER_PORTAL_HANDOVER_REVIEW_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Owner review',
  breadcrumb: 'Review',
  analyticsName: 'builder_portal_handover_review',
};

export const BUILDER_PORTAL_HANDOVER_SIGNATURE_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Signature',
  breadcrumb: 'Signature',
  analyticsName: 'builder_portal_handover_signature',
};

export const BUILDER_PORTAL_HANDOVER_COMPLETION_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Completion',
  breadcrumb: 'Completion',
  analyticsName: 'builder_portal_handover_completion',
};

export const BUILDER_PORTAL_HANDOVER_CERTIFICATE_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Certificate',
  breadcrumb: 'Certificate',
  analyticsName: 'builder_portal_handover_certificate',
};

export const BUILDER_PORTAL_HANDOVER_ARCHIVE_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Archive',
  breadcrumb: 'Archive',
  analyticsName: 'builder_portal_handover_archive',
};

export const BUILDER_PORTAL_HANDOVER_DOCUMENTS_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Handover documents',
  breadcrumb: 'Documents',
  analyticsName: 'builder_portal_handover_documents',
};

export const BUILDER_PORTAL_HANDOVER_INVITATION_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Invitation',
  breadcrumb: 'Invitation',
  analyticsName: 'builder_portal_handover_invitation',
};

export const BUILDER_PORTAL_HANDOVER_ACTIVATION_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Activation',
  breadcrumb: 'Activation',
  analyticsName: 'builder_portal_handover_activation',
};

export const BUILDER_PORTAL_HANDOVER_AUDIT_METADATA: RouteMetadata = {
  ...BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  title: 'Audit',
  breadcrumb: 'Audit',
  analyticsName: 'builder_portal_handover_audit',
};
