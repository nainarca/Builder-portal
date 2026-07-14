import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { formatRupees } from '../../config/billing.config';
import { InvoiceRecord } from '../../models/billing-admin.model';
import { BillPaymentStatusBadgeComponent } from './bill-payment-status-badge.component';

@Component({
  selector: 'app-bill-invoice-card',
  imports: [BillPaymentStatusBadgeComponent],
  template: `
    <article class="bill-invoice-card">
      <button
        type="button"
        class="bill-invoice-card__button"
        (click)="openInvoice.emit(invoice())"
      >
        <header class="bill-invoice-card__header">
          <div>
            <h3 class="bill-invoice-card__number">{{ invoice().number }}</h3>
            <p class="bill-invoice-card__org">{{ invoice().organizationName }}</p>
          </div>
          <span class="bill-invoice-card__total">{{ formatRupees(invoice().total) }}</span>
        </header>

        <div class="bill-invoice-card__badges">
          <app-bill-payment-status-badge [status]="invoice().status" />
          <app-bill-payment-status-badge [status]="invoice().paymentStatus" />
        </div>
      </button>
    </article>
  `,
  styles: `
    .bill-invoice-card {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      overflow: hidden;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .bill-invoice-card:hover {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 35%, var(--mpa-color-border));
      box-shadow: 0 1px 0 color-mix(in srgb, var(--mpa-color-text) 4%, transparent);
    }

    .bill-invoice-card__button {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1rem);
      width: 100%;
      padding: var(--mpa-spacing-md, 1.15rem);
      border: 0;
      background: transparent;
      text-align: left;
      cursor: pointer;
      font: inherit;
      color: inherit;
    }

    .bill-invoice-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .bill-invoice-card__number {
      margin: 0 0 0.2rem;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-invoice-card__org {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-invoice-card__total {
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
      white-space: nowrap;
    }

    .bill-invoice-card__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillInvoiceCardComponent {
  readonly invoice = input.required<InvoiceRecord>();
  readonly openInvoice = output<InvoiceRecord>();

  readonly formatRupees = formatRupees;
}
