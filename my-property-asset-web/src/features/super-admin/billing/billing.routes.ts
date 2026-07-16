import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_BILLING_ALERTS_METADATA,
  SUPER_ADMIN_BILLING_INVOICE_DETAIL_METADATA,
  SUPER_ADMIN_BILLING_INVOICES_METADATA,
  SUPER_ADMIN_BILLING_LICENSES_METADATA,
  SUPER_ADMIN_BILLING_METADATA,
  SUPER_ADMIN_BILLING_PLANS_METADATA,
  SUPER_ADMIN_BILLING_USAGE_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { BillingDashboardPageComponent } from './pages/billing-dashboard-page.component';
import {
  BillingInvoiceDetailPageComponent,
  BillingInvoicesPageComponent,
} from './pages/billing-invoices-page.component';
import { BillingPlansPageComponent } from './pages/billing-plans-page.component';
import {
  BillingAlertsPageComponent,
  BillingLicensesPageComponent,
  BillingUsagePageComponent,
} from './pages/billing-support-pages.component';

export const BILLING_ADMIN_ROUTE_CHILDREN: Routes = [
  {
    path: '',
    component: BillingDashboardPageComponent,
    data: SUPER_ADMIN_BILLING_METADATA,
  },
  {
    path: 'plans',
    component: BillingPlansPageComponent,
    data: SUPER_ADMIN_BILLING_PLANS_METADATA,
  },
  {
    path: 'invoices',
    component: BillingInvoicesPageComponent,
    data: SUPER_ADMIN_BILLING_INVOICES_METADATA,
  },
  {
    path: 'invoices/:id',
    component: BillingInvoiceDetailPageComponent,
    data: SUPER_ADMIN_BILLING_INVOICE_DETAIL_METADATA,
  },
  {
    path: 'licenses',
    component: BillingLicensesPageComponent,
    data: SUPER_ADMIN_BILLING_LICENSES_METADATA,
  },
  {
    path: 'usage',
    component: BillingUsagePageComponent,
    data: SUPER_ADMIN_BILLING_USAGE_METADATA,
  },
  {
    path: 'notifications',
    component: BillingAlertsPageComponent,
    data: SUPER_ADMIN_BILLING_ALERTS_METADATA,
  },
];
