import { Routes } from '@angular/router';

import { BUILDER_PORTAL_METADATA } from '../../core/constants/route-metadata.constants';
import { BuilderPortalLayoutComponent } from '../../layouts/builder-portal/builder-portal-layout.component';
import { navigationResolver } from '../../navigation/resolvers';
import { BuilderPortalPlaceholder } from './builder-portal-placeholder.component';

export const BUILDER_PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: BuilderPortalLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'builder-portal',
      navigationContext: 'builder-portal',
    },
    children: [
      {
        path: '',
        component: BuilderPortalPlaceholder,
        data: BUILDER_PORTAL_METADATA,
      },
    ],
  },
];
