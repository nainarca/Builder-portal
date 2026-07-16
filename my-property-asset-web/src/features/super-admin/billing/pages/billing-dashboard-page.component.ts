import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';
import { BillAlertsPanelComponent } from '../components/alerts';
import {
  BillCommercialOverviewComponent,
  BillQuickActionsComponent,
  BillSubscriptionListComponent,
} from '../components/dashboard';
import { BillPaymentProvidersComponent } from '../components/invoices';
import {
  BillRenewalBannerComponent,
  BillSectionNavComponent,
} from '../components/shared';

@Component({
  selector: 'app-billing-dashboard-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    BillSectionNavComponent,
    BillRenewalBannerComponent,
    BillCommercialOverviewComponent,
    BillQuickActionsComponent,
    BillSubscriptionListComponent,
    BillAlertsPanelComponent,
    BillPaymentProvidersComponent,
  ],
  template: `
    <app-base-page>
      <div class="bill-page">
        <app-page-header
          eyebrow="Commercial"
          title="Subscription & billing"
          description="Manage builder plans, subscriptions, invoices, usage, and payment provider readiness."
        />
        <app-bill-section-nav />
        <app-bill-renewal-banner
          title="Renewal readiness"
          message="Payment gateway checkout is abstracted for V1. Manual collection and provider placeholders are available under Invoices."
          severity="info"
          actionLabel="View invoices"
          actionRoute="/super-admin/billing/invoices"
        />
        <app-bill-commercial-overview />
        <app-bill-quick-actions />
        <app-bill-subscription-list />
        <app-bill-alerts-panel />
        <app-bill-payment-providers />
      </div>
    </app-base-page>
  `,
  styles: `
    .bill-page {
      display: grid;
      gap: var(--mpa-spacing-lg, 1.5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingDashboardPageComponent {}
