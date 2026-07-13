import { Injectable, computed, signal } from '@angular/core';

import { BillingPeriod } from '../models/pricing.model';

@Injectable({ providedIn: 'root' })
export class PricingBillingService {
  private readonly periodSignal = signal<BillingPeriod>('annual');

  readonly period = this.periodSignal.asReadonly();
  readonly isAnnual = computed(() => this.periodSignal() === 'annual');
  readonly discountLabel = computed(() => (this.isAnnual() ? 'Save 20%' : null));

  setPeriod(period: BillingPeriod): void {
    this.periodSignal.set(period);
  }

  toggle(): void {
    this.periodSignal.update((current) => (current === 'monthly' ? 'annual' : 'monthly'));
  }
}
