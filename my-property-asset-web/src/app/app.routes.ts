import { Routes } from '@angular/router';

import { authenticatedGuard } from '@core/auth';
import { authorizationGuard, portalGuard } from '@core/rbac';
import { PORTAL_PERMISSION_KEYS } from '@core/rbac/constants/rbac.constants';
import { APP_ROUTES } from '@core/constants/app.constants';
import { BlankLayoutComponent, BlankPageComponent } from '../layouts';
import { navigationResolver } from '../navigation/resolvers';

export const routes: Routes = [
  {
    path: APP_ROUTES.publicWebsite,
    loadChildren: () =>
      import('../features/public-website/public-website.routes').then(
        (m) => m.PUBLIC_WEBSITE_ROUTES,
      ),
  },
  {
    path: APP_ROUTES.authentication,
    loadChildren: () =>
      import('../features/authentication/authentication.routes').then(
        (m) => m.AUTHENTICATION_ROUTES,
      ),
  },
  {
    path: APP_ROUTES.superAdmin,
    canActivate: [authenticatedGuard, portalGuard, authorizationGuard],
    data: {
      portal: PORTAL_PERMISSION_KEYS.superAdmin,
      roles: ['super-admin', 'support-user'],
      permissions: ['portal:super-admin'],
      organizationContext: true,
    },
    loadChildren: () =>
      import('../features/super-admin/super-admin.routes').then((m) => m.SUPER_ADMIN_ROUTES),
  },
  {
    path: APP_ROUTES.builderPortal,
    canActivate: [authenticatedGuard, portalGuard, authorizationGuard],
    data: {
      portal: PORTAL_PERMISSION_KEYS.builderPortal,
      roles: ['builder-org-owner', 'builder-org-admin', 'builder-org-member', 'support-user'],
      permissions: ['portal:builder-portal'],
      organizationContext: true,
    },
    loadChildren: () =>
      import('../features/builder-portal/builder-portal.routes').then(
        (m) => m.BUILDER_PORTAL_ROUTES,
      ),
  },
  {
    path: APP_ROUTES.forbidden,
    component: BlankLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'blank',
      navigationContext: 'blank',
    },
    children: [
      {
        path: '',
        component: BlankPageComponent,
        data: {
          pageTitle: 'Access Denied',
          pageDescription: 'You do not have permission to access this resource.',
          blankPageCode: 403,
          title: 'Access Denied',
          breadcrumb: 'Access Denied',
          visible: false,
        },
      },
    ],
  },
  {
    path: APP_ROUTES.notFound,
    component: BlankLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'blank',
      navigationContext: 'blank',
    },
    children: [
      {
        path: '',
        component: BlankPageComponent,
        data: {
          pageTitle: 'Page Not Found',
          pageDescription: 'The page you are looking for does not exist.',
          blankPageCode: 404,
          title: 'Page Not Found',
          breadcrumb: 'Page Not Found',
          visible: false,
        },
      },
    ],
  },
  {
    path: APP_ROUTES.serverError,
    component: BlankLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'blank',
      navigationContext: 'blank',
    },
    children: [
      {
        path: '',
        component: BlankPageComponent,
        data: {
          pageTitle: 'Server Error',
          pageDescription: 'An unexpected error occurred. Please try again later.',
          blankPageCode: 500,
          title: 'Server Error',
          breadcrumb: 'Server Error',
          visible: false,
        },
      },
    ],
  },
  {
    path: APP_ROUTES.maintenance,
    component: BlankLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'blank',
      navigationContext: 'blank',
    },
    children: [
      {
        path: '',
        component: BlankPageComponent,
        data: {
          pageTitle: 'Under Maintenance',
          pageDescription: 'The platform is temporarily unavailable for scheduled maintenance.',
          pageVariant: 'maintenance',
          title: 'Under Maintenance',
          breadcrumb: 'Maintenance',
          visible: false,
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.notFound,
  },
];
