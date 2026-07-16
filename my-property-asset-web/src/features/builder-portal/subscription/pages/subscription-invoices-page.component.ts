import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';
import { formatMoney } from '../config/subscription.config';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-subscription-invoices-page',
  imports: [RouterLink, BasePageComponent, PageHeaderComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="inv-page">
        <app-page-header
          eyebrow="Billing"
          title="Invoices & payments"
          description="Invoice history and payment records. PDF download is a placeholder in V1."
        >
          <app-button pageActions label="Generate invoice" icon="pi pi-file" (clicked)="generate()" />
          <a pageActions routerLink="/builder-portal/subscription">Back</a>
        </app-page-header>

        <section class="inv-card">
          <h3>Invoices</h3>
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Status</th>
                <th>Total</th>
                <th>Issued</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              @for (invoice of invoices; track invoice.id) {
                <tr>
                  <td>{{ invoice.invoiceNumber }}</td>
                  <td>{{ invoice.status }}</td>
                  <td>{{ formatMoney(invoice.totalMinor, invoice.currency) }}</td>
                  <td>{{ formatDate(invoice.issuedAt) }}</td>
                  <td>
                    <app-button
                      label="Download"
                      [outlined]="true"
                      (clicked)="downloadPlaceholder(invoice.invoiceNumber)"
                    />
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="5">No invoices yet.</td></tr>
              }
            </tbody>
          </table>
        </section>

        <section class="inv-card">
          <h3>Payment history</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              @for (payment of payments; track payment.id) {
                <tr>
                  <td>{{ formatDate(payment.paidAt ?? payment.createdAt) }}</td>
                  <td>{{ formatMoney(payment.amountMinor, payment.currency) }}</td>
                  <td>{{ payment.paymentStatus }}</td>
                  <td>{{ payment.paymentMethod ?? '—' }}</td>
                  <td>{{ payment.transactionReference ?? '—' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="5">No payments recorded.</td></tr>
              }
            </tbody>
          </table>
        </section>
      </div>
    </app-base-page>
  `,
  styles: `
    .inv-page { display: grid; gap: 1rem; }
    .inv-card {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      padding: 1rem;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.65rem; border-bottom: 1px solid var(--mpa-color-border); text-align: left; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionInvoicesPageComponent {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly toast = inject(UiToastService);

  readonly invoices = this.subscriptionService.listInvoices();
  readonly payments = this.subscriptionService.listPayments();

  generate(): void {
    const invoice = this.subscriptionService.generateInvoice();
    if (!invoice) {
      this.toast.error('Unable to generate invoice');
      return;
    }
    this.toast.success('Invoice generated', invoice.invoiceNumber);
  }

  downloadPlaceholder(invoiceNumber: string): void {
    this.toast.info('PDF placeholder', `${invoiceNumber} download will be available after storage wiring.`);
  }

  formatMoney = formatMoney;

  formatDate(value?: string): string {
    return value ? new Date(value).toLocaleDateString() : '—';
  }
}
