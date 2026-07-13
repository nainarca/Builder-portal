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
