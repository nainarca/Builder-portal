import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_BRANDING_METADATA,
  BUILDER_PORTAL_DASHBOARD_METADATA,
} from '../../core/constants/route-metadata.constants';
import { BuilderPortalLayoutComponent } from '../../layouts/builder-portal/builder-portal-layout.component';
import { navigationResolver } from '../../navigation/resolvers';
import { BuilderBrandingPageComponent } from './branding/pages/builder-branding-page.component';
import { BuilderDashboardComponent } from './builder-dashboard.component';
import { BuilderCompanyPageComponent } from './organization/pages/builder-company-page.component';
import { BuilderInvitationPageComponent } from './organization/pages/builder-invitation-page.component';
import { BuilderSettingsPageComponent } from './organization/pages/builder-settings-page.component';

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
        component: BuilderDashboardComponent,
        data: BUILDER_PORTAL_DASHBOARD_METADATA,
      },
      {
        path: 'company',
        component: BuilderCompanyPageComponent,
        data: {
          title: 'Company',
          breadcrumb: 'Company',
          permissions: ['portal:builder-portal', 'id-03-organization-tenancy:read'],
          analyticsName: 'builder_portal_company',
        },
      },
      {
        path: 'branding',
        component: BuilderBrandingPageComponent,
        data: BUILDER_PORTAL_BRANDING_METADATA,
      },
      {
        path: 'settings',
        component: BuilderSettingsPageComponent,
        data: {
          title: 'Settings',
          breadcrumb: 'Settings',
          permissions: ['portal:builder-portal', 'id-03-organization-tenancy:operate'],
          analyticsName: 'builder_portal_settings',
        },
      },
      {
        path: 'invitation',
        component: BuilderInvitationPageComponent,
        data: {
          title: 'Invitation',
          breadcrumb: 'Invitation',
          analyticsName: 'builder_portal_invitation',
        },
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.routes').then((m) => m.PROJECT_ROUTES),
      },
      {
        path: 'owners',
        loadChildren: () => import('./owners/owners.routes').then((m) => m.OWNER_ROUTES),
      },
      {
        path: 'documents',
        loadChildren: () => import('./documents/documents.routes').then((m) => m.DOCUMENT_ROUTES),
      },
      {
        path: 'handovers',
        loadChildren: () => import('./handovers/handovers.routes').then((m) => m.HANDOVER_ROUTES),
      },
      {
        path: 'communications',
        loadChildren: () =>
          import('./communications/communications.routes').then((m) => m.COMMUNICATION_ROUTES),
      },
    ],
  },
];
