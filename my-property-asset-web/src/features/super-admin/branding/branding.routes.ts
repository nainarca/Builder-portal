import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_BRANDING_METADATA,
  SUPER_ADMIN_BRANDING_STUDIO_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { brandUnsavedChangesGuard } from './guards/brand-unsaved-changes.guard';
import { BrandDashboardPageComponent } from './pages/brand-dashboard-page.component';
import { BrandStudioPageComponent } from './pages/brand-studio-page.component';

export const BRANDING_ADMIN_ROUTE_CHILDREN: Routes = [
  {
    path: '',
    component: BrandDashboardPageComponent,
    data: SUPER_ADMIN_BRANDING_METADATA,
  },
  {
    path: 'studio',
    component: BrandStudioPageComponent,
    canDeactivate: [brandUnsavedChangesGuard],
    data: SUPER_ADMIN_BRANDING_STUDIO_METADATA,
  },
];
