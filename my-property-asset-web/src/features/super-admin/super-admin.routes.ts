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
    ],
  },
];
