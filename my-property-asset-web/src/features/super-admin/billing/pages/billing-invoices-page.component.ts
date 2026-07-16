import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';
import {
  BillAddressFormComponent,
  BillInvoiceDetailComponent,
  BillInvoiceListComponent,
  BillPaymentProvidersComponent,
} from '../components/invoices';
import { BillSectionNavComponent } from '../components/shared';

@Component({
  selector: 'app-billing-invoices-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    BillSectionNavComponent,
    BillInvoiceListComponent,
    BillAddressFormComponent,
    BillPaymentProvidersComponent,
  ],
  template: `
    <app-base-page>
      <div class="bill-page">
        <app-page-header
          eyebrow="Invoices"
          title="Invoice management"
          description="View builder invoices, billing address, and payment provider readiness."
        />
        <app-bill-section-nav />
        <app-bill-invoice-list />
        <app-bill-address-form />
        <app-bill-payment-providers />
      </div>
    </app-base-page>
  `,
  styles: `
    .bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingInvoicesPageComponent {}

@Component({
  selector: 'app-billing-invoice-detail-page',
  imports: [BasePageComponent, PageHeaderComponent, BillSectionNavComponent, BillInvoiceDetailComponent],
  template: `
    <app-base-page>
      <div class="bill-page">
        <app-page-header eyebrow="Invoice" title="Invoice detail" description="Invoice line items and payment status." />
        <app-bill-section-nav />
        <app-bill-invoice-detail />
      </div>
    </app-base-page>
  `,
  styles: `
    .bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingInvoiceDetailPageComponent {}
