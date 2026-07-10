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
    title: 'MyPropertyAsset — Enterprise Property Asset Management',
    description:
      'Unify portfolios, projects, and stakeholders with a premium enterprise platform for builders, investors, and operators.',
    keywords: [
      'property asset management',
      'enterprise SaaS',
      'builder portal',
      'portfolio visibility',
      'white-label property platform',
    ],
    ogType: 'website',
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
            'Enterprise property asset management platform for builders, investors, and operators.',
        },
      },
      {
        id: 'website',
        data: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'MyPropertyAsset',
          url: 'https://mypropertyasset.com',
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
