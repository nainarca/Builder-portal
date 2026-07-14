import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { InvoiceRecord } from '../../models/billing-admin.model';
import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillingViewStateService } from '../../services/billing-view-state.service';
import { BillInvoiceCardComponent } from '../shared/bill-invoice-card.component';

type InvoiceFilter = 'all' | 'paid' | 'open' | 'past_due';

@Component({
  selector: 'app-bill-invoice-list',
  imports: [BillInvoiceCardComponent],
  template: `
    <section class="bill-invoice-list" aria-label="Invoices">
      <header class="bill-invoice-list__header">
        <div>
          <h2 class="bill-invoice-list__title">Invoices</h2>
          <p class="bill-invoice-list__subtitle">Filter and open commercial invoices.</p>
        </div>
        <div class="bill-invoice-list__filters" role="group" aria-label="Invoice status filter">
          @for (filter of filters; track filter.id) {
            <button
              type="button"
              class="bill-invoice-list__chip"
              [class.bill-invoice-list__chip--active]="viewState.invoiceFilter() === filter.id"
              (click)="viewState.setInvoiceFilter(filter.id)"
            >
              {{ filter.label }}
            </button>
          }
        </div>
      </header>

      <div class="bill-invoice-list__grid">
        @for (invoice of filtered(); track invoice.id) {
          <app-bill-invoice-card [invoice]="invoice" (openInvoice)="open($event)" />
        } @empty {
          <p class="bill-invoice-list__empty">No invoices match this filter.</p>
        }
      </div>
    </section>
  `,
  styles: `
    .bill-invoice-list {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-invoice-list__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
    }

    .bill-invoice-list__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-invoice-list__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-invoice-list__filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .bill-invoice-list__chip {
      border: 1px solid var(--mpa-color-border);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text-muted);
      font: inherit;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      cursor: pointer;
    }

    .bill-invoice-list__chip--active {
      border-color: var(--mpa-color-primary);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
    }

    .bill-invoice-list__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-invoice-list__empty {
      margin: 0;
      padding: var(--mpa-spacing-md, 1.25rem);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillInvoiceListComponent {
  readonly store = inject(BillingAdminStoreService);
  readonly viewState = inject(BillingViewStateService);
  private readonly router = inject(Router);

  readonly filters: readonly { id: InvoiceFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'paid', label: 'Paid' },
    { id: 'open', label: 'Open' },
    { id: 'past_due', label: 'Past due' },
  ];

  readonly filtered = computed(() => {
    const filter = this.viewState.invoiceFilter();
    const invoices = this.store.invoices();
    if (filter === 'all') return invoices;
    return invoices.filter((invoice) => invoice.status === filter);
  });

  open(invoice: InvoiceRecord | string): void {
    const id = typeof invoice === 'string' ? invoice : invoice.id;
    void this.router.navigate(['/super-admin/billing/invoices', id]);
  }
}
