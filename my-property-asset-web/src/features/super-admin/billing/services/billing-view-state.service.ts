import { Injectable, computed, signal } from '@angular/core';

import { BillingInterval } from '../models/billing-admin.model';

@Injectable({ providedIn: 'root' })
export class BillingViewStateService {
  readonly comparePlanIds = signal<readonly string[]>(['plan-starter', 'plan-growth', 'plan-business']);
  readonly billingInterval = signal<BillingInterval>('annual');
  readonly invoiceFilter = signal<'all' | 'paid' | 'open' | 'past_due'>('all');
  readonly alertFilter = signal<'all' | 'open' | 'acknowledged'>('all');
  readonly dirtyAddress = signal(false);

  readonly isComparing = computed(() => this.comparePlanIds().length >= 2);

  setInterval(interval: BillingInterval): void {
    this.billingInterval.set(interval);
  }

  toggleComparePlan(planId: string): void {
    this.comparePlanIds.update((ids) =>
      ids.includes(planId) ? ids.filter((id) => id !== planId) : [...ids, planId].slice(-4),
    );
  }

  setInvoiceFilter(filter: 'all' | 'paid' | 'open' | 'past_due'): void {
    this.invoiceFilter.set(filter);
  }

  setAlertFilter(filter: 'all' | 'open' | 'acknowledged'): void {
    this.alertFilter.set(filter);
  }

  markAddressDirty(dirty = true): void {
    this.dirtyAddress.set(dirty);
  }
}
