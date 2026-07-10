import { Routes } from '@angular/router';

import { SUPER_ADMIN_METADATA } from '../../core/constants/route-metadata.constants';
import { SuperAdminLayoutComponent } from '../../layouts/super-admin/super-admin-layout.component';
import { navigationResolver } from '../../navigation/resolvers';
import { SuperAdminPlaceholder } from './super-admin-placeholder.component';

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
        component: SuperAdminPlaceholder,
        data: SUPER_ADMIN_METADATA,
      },
    ],
  },
];
