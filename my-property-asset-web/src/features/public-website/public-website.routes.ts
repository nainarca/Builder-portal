import { Routes } from '@angular/router';

import { PUBLIC_HOME_METADATA } from '../../core/constants/route-metadata.constants';
import { PublicLayoutComponent } from '../../layouts/public/public-layout.component';
import { navigationResolver } from '../../navigation/resolvers';
import { PublicWebsiteHome } from './public-website-home.component';

export const PUBLIC_WEBSITE_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'public',
      navigationContext: 'public-website',
    },
    children: [
      {
        path: '',
        component: PublicWebsiteHome,
        data: PUBLIC_HOME_METADATA,
      },
    ],
  },
];
