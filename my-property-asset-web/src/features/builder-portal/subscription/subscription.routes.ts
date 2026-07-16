import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_SUBSCRIPTION_INVOICES_METADATA,
  BUILDER_PORTAL_SUBSCRIPTION_METADATA,
  BUILDER_PORTAL_SUBSCRIPTION_PLANS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { SubscriptionInvoicesPageComponent } from './pages/subscription-invoices-page.component';
import { SubscriptionOverviewPageComponent } from './pages/subscription-overview-page.component';
import { SubscriptionPlansPageComponent } from './pages/subscription-plans-page.component';

export const SUBSCRIPTION_ROUTES: Routes = [
  {
    path: '',
    component: SubscriptionOverviewPageComponent,
    data: BUILDER_PORTAL_SUBSCRIPTION_METADATA,
  },
  {
    path: 'plans',
    component: SubscriptionPlansPageComponent,
    data: BUILDER_PORTAL_SUBSCRIPTION_PLANS_METADATA,
  },
  {
    path: 'invoices',
    component: SubscriptionInvoicesPageComponent,
    data: BUILDER_PORTAL_SUBSCRIPTION_INVOICES_METADATA,
  },
];
