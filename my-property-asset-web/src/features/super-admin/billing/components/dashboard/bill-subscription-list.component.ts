import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SubscriptionRecord } from '../../models/billing-admin.model';
import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillSubscriptionCardComponent } from '../shared/bill-subscription-card.component';

@Component({
  selector: 'app-bill-subscription-list',
  imports: [BillSubscriptionCardComponent],
  template: `
    <section class="bill-subscription-list" aria-label="Subscriptions">
      <header class="bill-subscription-list__header">
        <h2 class="bill-subscription-list__title">Subscriptions</h2>
        <span class="bill-subscription-list__count">{{ store.subscriptions().length }}</span>
      </header>

      <div class="bill-subscription-list__grid">
        @for (sub of store.subscriptions(); track sub.id) {
          <app-bill-subscription-card
            [subscription]="sub"
            (selectSubscription)="onSelect($event)"
          />
        } @empty {
          <p class="bill-subscription-list__empty">No subscriptions yet.</p>
        }
      </div>
    </section>
  `,
  styles: `
    .bill-subscription-list {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-subscription-list__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .bill-subscription-list__title {
      margin: 0;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-subscription-list__count {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      color: var(--mpa-color-text-muted);
      padding: 0.15rem 0.55rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: 999px;
    }

    .bill-subscription-list__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-subscription-list__empty {
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
export class BillSubscriptionListComponent {
  readonly store = inject(BillingAdminStoreService);
  private readonly router = inject(Router);

  onSelect(subscription: SubscriptionRecord | string): void {
    const sub =
      typeof subscription === 'string'
        ? this.store.getSubscription(subscription)
        : subscription;
    if (!sub) return;
    const path =
      sub.status === 'past_due'
        ? '/super-admin/billing/invoices'
        : '/super-admin/billing/plans';
    void this.router.navigateByUrl(path);
  }
}
