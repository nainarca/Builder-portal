import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { formatRupees } from '../../config/billing.config';
import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillPaymentStatusBadgeComponent } from '../shared/bill-payment-status-badge.component';

@Component({
  selector: 'app-bill-invoice-detail',
  imports: [RouterLink, BillPaymentStatusBadgeComponent],
  template: `
    <section class="bill-invoice-detail" aria-label="Invoice detail">
      <a class="bill-invoice-detail__back" routerLink="/super-admin/billing/invoices">
        <i class="pi pi-arrow-left" aria-hidden="true"></i>
        Back to invoices
      </a>

      @if (invoice(); as inv) {
        <header class="bill-invoice-detail__header">
          <div>
            <p class="bill-invoice-detail__eyebrow">Invoice</p>
            <h2 class="bill-invoice-detail__title">{{ inv.number }}</h2>
            <p class="bill-invoice-detail__org">{{ inv.organizationName }}</p>
          </div>
          <div class="bill-invoice-detail__badges">
            <app-bill-payment-status-badge [status]="inv.paymentStatus" />
            <app-bill-payment-status-badge [status]="inv.status" />
          </div>
        </header>

        <div class="bill-invoice-detail__meta">
          <div class="bill-invoice-detail__meta-item">
            <span class="bill-invoice-detail__meta-label">Issued</span>
            <span>{{ formatDate(inv.issuedAt) }}</span>
          </div>
          <div class="bill-invoice-detail__meta-item">
            <span class="bill-invoice-detail__meta-label">Due</span>
            <span>{{ formatDate(inv.dueAt) }}</span>
          </div>
          @if (inv.paidAt) {
            <div class="bill-invoice-detail__meta-item">
              <span class="bill-invoice-detail__meta-label">Paid</span>
              <span>{{ formatDate(inv.paidAt) }}</span>
            </div>
          }
        </div>

        <div class="bill-invoice-detail__table-wrap">
          <table class="bill-invoice-detail__table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Qty</th>
                <th scope="col">Unit</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              @for (line of inv.lines; track line.id) {
                <tr>
                  <td>{{ line.description }}</td>
                  <td>{{ line.quantity }}</td>
                  <td>{{ formatRupees(line.unitAmount) }}</td>
                  <td>{{ formatRupees(line.amount) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="bill-invoice-detail__footer">
          <aside class="bill-invoice-detail__address">
            <h3 class="bill-invoice-detail__section-title">Billing address</h3>
            <p>{{ inv.billingAddress.line1 }}</p>
            <p>
              {{ inv.billingAddress.city }}, {{ inv.billingAddress.region }}
              {{ inv.billingAddress.postalCode }}
            </p>
            <p>{{ inv.billingAddress.country }}</p>
            @if (inv.taxId) {
              <p class="bill-invoice-detail__tax-id">Tax ID: {{ inv.taxId }}</p>
            }
          </aside>

          <dl class="bill-invoice-detail__totals">
            <div class="bill-invoice-detail__total-row">
              <dt>Subtotal</dt>
              <dd>{{ formatRupees(inv.subtotal) }}</dd>
            </div>
            <div class="bill-invoice-detail__total-row">
              <dt>Tax</dt>
              <dd>{{ formatRupees(inv.tax) }}</dd>
            </div>
            <div class="bill-invoice-detail__total-row bill-invoice-detail__total-row--grand">
              <dt>Total</dt>
              <dd>{{ formatRupees(inv.total) }}</dd>
            </div>
          </dl>
        </div>
      } @else {
        <p class="bill-invoice-detail__empty">Invoice not found.</p>
      }
    </section>
  `,
  styles: `
    .bill-invoice-detail {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-invoice-detail__back {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      width: fit-content;
      color: var(--mpa-color-primary);
      text-decoration: none;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
    }

    .bill-invoice-detail__header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }

    .bill-invoice-detail__eyebrow {
      margin: 0 0 0.2rem;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }

    .bill-invoice-detail__title {
      margin: 0;
      font-size: var(--mpa-font-size-xl, 1.5rem);
      color: var(--mpa-color-text);
    }

    .bill-invoice-detail__org {
      margin: 0.35rem 0 0;
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }

    .bill-invoice-detail__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .bill-invoice-detail__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
    }

    .bill-invoice-detail__meta-item {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }

    .bill-invoice-detail__meta-label {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }

    .bill-invoice-detail__table-wrap {
      overflow-x: auto;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
    }

    .bill-invoice-detail__table {
      width: 100%;
      border-collapse: collapse;
      min-width: 32rem;
    }

    .bill-invoice-detail__table th,
    .bill-invoice-detail__table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--mpa-color-border);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }

    .bill-invoice-detail__table th {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-background, #f4f6f9) 80%, transparent);
    }

    .bill-invoice-detail__table tbody tr:last-child td {
      border-bottom: 0;
    }

    .bill-invoice-detail__footer {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-invoice-detail__address,
    .bill-invoice-detail__totals {
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }

    .bill-invoice-detail__section-title {
      margin: 0 0 0.65rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-invoice-detail__address p {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-invoice-detail__tax-id {
      margin-top: 0.65rem !important;
      font-weight: 600;
      color: var(--mpa-color-text) !important;
    }

    .bill-invoice-detail__totals {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .bill-invoice-detail__total-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }

    .bill-invoice-detail__total-row dt {
      margin: 0;
      color: var(--mpa-color-text-muted);
    }

    .bill-invoice-detail__total-row dd {
      margin: 0;
      font-weight: 600;
    }

    .bill-invoice-detail__total-row--grand {
      padding-top: 0.65rem;
      border-top: 1px solid var(--mpa-color-border);
      font-size: var(--mpa-font-size-md, 1rem);
    }

    .bill-invoice-detail__total-row--grand dt,
    .bill-invoice-detail__total-row--grand dd {
      color: var(--mpa-color-text);
      font-weight: 700;
    }

    .bill-invoice-detail__empty {
      margin: 0;
      padding: var(--mpa-spacing-md, 1.25rem);
      color: var(--mpa-color-text-muted);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillInvoiceDetailComponent {
  private readonly store = inject(BillingAdminStoreService);
  private readonly route = inject(ActivatedRoute);

  readonly invoiceId = input<string | undefined>(undefined);

  private readonly routeInvoiceId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? undefined)),
    { initialValue: undefined as string | undefined },
  );

  readonly invoice = computed(() => {
    const id = this.invoiceId() ?? this.routeInvoiceId();
    return id ? this.store.getInvoice(id) : undefined;
  });

  readonly formatRupees = formatRupees;

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }
}
