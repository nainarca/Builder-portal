import { Routes } from '@angular/router';

import { BuilderCompanyPageComponent } from './pages/builder-company-page.component';
import { BuilderInvitationPageComponent } from './pages/builder-invitation-page.component';
import { BuilderSettingsPageComponent } from './pages/builder-settings-page.component';

export const BUILDER_ORGANIZATION_ROUTES: Routes = [
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
      permissions: ['portal:builder-portal'],
      analyticsName: 'builder_portal_invitation',
    },
  },
];
