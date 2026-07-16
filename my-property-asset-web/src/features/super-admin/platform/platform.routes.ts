import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_ANALYTICS_METADATA,
  SUPER_ADMIN_BRANDING_OVERSIGHT_METADATA,
  SUPER_ADMIN_SUPPORT_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { BrandingOversightPageComponent } from './pages/branding-oversight-page.component';
import { PlatformAnalyticsPageComponent } from './pages/platform-analytics-page.component';
import { SupportCenterPageComponent } from './pages/support-center-page.component';

export const PLATFORM_ADMIN_ROUTE_CHILDREN: Routes = [
  {
    path: 'support',
    component: SupportCenterPageComponent,
    data: SUPER_ADMIN_SUPPORT_METADATA,
  },
  {
    path: 'analytics',
    component: PlatformAnalyticsPageComponent,
    data: SUPER_ADMIN_ANALYTICS_METADATA,
  },
  {
    path: 'branding-oversight',
    component: BrandingOversightPageComponent,
    data: SUPER_ADMIN_BRANDING_OVERSIGHT_METADATA,
  },
];
