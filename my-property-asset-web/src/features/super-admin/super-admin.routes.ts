import { Routes } from '@angular/router';

import { SUPER_ADMIN_DASHBOARD_METADATA } from '../../core/constants/route-metadata.constants';
import { SuperAdminLayoutComponent } from '../../layouts/super-admin/super-admin-layout.component';
import { navigationResolver } from '../../navigation/resolvers';
import { SuperAdminDashboardComponent } from './super-admin-dashboard.component';

export const SUPER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: SuperAdminLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'super-admin',
      navigationContext: 'super-admin',
    },
    children: [
      {
        path: '',
        component: SuperAdminDashboardComponent,
        data: SUPER_ADMIN_DASHBOARD_METADATA,
      },
      {
        path: 'organizations',
        loadChildren: () =>
          import('./organizations/organizations.routes').then(
            (m) => m.ORGANIZATION_ADMIN_ROUTE_CHILDREN,
          ),
      },
      {
        path: 'builders',
        loadChildren: () =>
          import('./builders/builders.routes').then((m) => m.BUILDER_ADMIN_ROUTE_CHILDREN),
      },
      {
        path: 'iam',
        loadChildren: () =>
          import('./iam/iam.routes').then((m) => m.IAM_ADMIN_ROUTE_CHILDREN),
      },
      {
        path: 'branding',
        loadChildren: () =>
          import('./branding/branding.routes').then((m) => m.BRANDING_ADMIN_ROUTE_CHILDREN),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.routes').then((m) => m.SETTINGS_ADMIN_ROUTE_CHILDREN),
      },
      {
        path: 'operations',
        loadChildren: () =>
          import('./operations/operations.routes').then((m) => m.OPERATIONS_ADMIN_ROUTE_CHILDREN),
      },
      {
        path: 'billing',
        loadChildren: () =>
          import('./billing/billing.routes').then((m) => m.BILLING_ADMIN_ROUTE_CHILDREN),
      },
    ],
  },
];
