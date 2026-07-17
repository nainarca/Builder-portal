import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '@shared/ui';
import {
  BillAddressFormComponent,
  BillInvoiceDetailComponent,
  BillInvoiceListComponent,
  BillPaymentProvidersComponent,
} from '../components/invoices';
import { BillSectionNavComponent } from '../components/shared';

import { SuperAdminPageComponent } from '../../components/layout';

@Component({
  selector: 'app-billing-invoices-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    BillSectionNavComponent,
    BillInvoiceListComponent,
    BillAddressFormComponent,
    BillPaymentProvidersComponent,
  ],
  template: `
    <app-sa-page>
      <div class="bill-page">
        <app-enterprise-form-page-header
          eyebrow="Invoices"
          title="Invoice management"
          subtitle="View builder invoices, billing address, and payment provider readiness."
          mode="view"
        />
        <app-bill-section-nav />
        <app-bill-invoice-list />
        <app-bill-address-form />
        <app-bill-payment-providers />
      </div>
    </app-sa-page>
  `,
  styles: `
    .bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingInvoicesPageComponent {}

@Component({
  selector: 'app-billing-invoice-detail-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    BillSectionNavComponent,
    BillInvoiceDetailComponent,
  ],
  template: `
    <app-sa-page>
      <div class="bill-page">
        <app-enterprise-form-page-header
          eyebrow="Invoice"
          title="Invoice detail"
          subtitle="Invoice line items and payment status."
          mode="view"
        />
        <app-bill-section-nav />
        <app-bill-invoice-detail />
      </div>
    </app-sa-page>
  `,
  styles: `
    .bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingInvoiceDetailPageComponent {}
