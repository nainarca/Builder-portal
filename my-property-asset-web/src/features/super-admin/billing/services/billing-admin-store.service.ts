import { Injectable, computed, signal } from '@angular/core';

import {
  MOCK_ALERTS,
  MOCK_INVOICES,
  MOCK_LICENSES,
  MOCK_PLANS,
  MOCK_SUBSCRIPTIONS,
  MOCK_TIMELINE,
  MOCK_USAGE,
} from '../config/billing.config';
import {
  BillingAddressDraft,
  CommercialAlert,
  CommercialOverview,
  InvoiceRecord,
  LicensePool,
  SubscriptionPlan,
  SubscriptionRecord,
  SubscriptionTimelineEvent,
  UsageMetric,
} from '../models/billing-admin.model';

@Injectable({ providedIn: 'root' })
export class BillingAdminStoreService {
  private readonly subscriptionsSignal = signal<readonly SubscriptionRecord[]>([
    ...MOCK_SUBSCRIPTIONS,
  ]);
  private readonly invoicesSignal = signal<readonly InvoiceRecord[]>([...MOCK_INVOICES]);
  private readonly licensesSignal = signal<readonly LicensePool[]>([...MOCK_LICENSES]);
  private readonly alertsSignal = signal<CommercialAlert[]>(
    MOCK_ALERTS.map((a) => ({ ...a })),
  );
  private readonly billingAddressSignal = signal<BillingAddressDraft>({
    line1: 'MyPropertyAsset HQ',
    city: 'Bengaluru',
    region: 'KA',
    postalCode: '560001',
    country: 'IN',
    taxId: '29AABCM0000A1Z9',
  });

  readonly subscriptions = this.subscriptionsSignal.asReadonly();
  readonly invoices = this.invoicesSignal.asReadonly();
  readonly licenses = this.licensesSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly plans = signal<readonly SubscriptionPlan[]>(MOCK_PLANS).asReadonly();
  readonly usage = signal<readonly UsageMetric[]>(MOCK_USAGE).asReadonly();
  readonly timeline = signal<readonly SubscriptionTimelineEvent[]>(MOCK_TIMELINE).asReadonly();
  readonly billingAddress = this.billingAddressSignal.asReadonly();

  readonly overview = computed<CommercialOverview>(() => {
    const subs = this.subscriptionsSignal();
    const licenses = this.licensesSignal();
    const active = subs.filter((s) => s.status === 'active').length;
    const trial = subs.filter((s) => s.status === 'trial').length;
    const pastDue = subs.filter((s) => s.status === 'past_due').length;
    const mrr = subs
      .filter((s) => s.status === 'active' || s.status === 'trial')
      .reduce((sum, s) => sum + (s.interval === 'annual' ? Math.round(s.amount / 12) : s.amount), 0);
    const allocated = licenses.reduce((s, l) => s + l.allocated, 0) || 1;
    const used = licenses.reduce((s, l) => s + l.used, 0);
    return {
      activeSubscriptions: active,
      trialCount: trial,
      pastDueCount: pastDue,
      mrr,
      currency: 'INR',
      licenseUtilization: Math.round((used / allocated) * 100),
      upcomingRenewals: subs.filter((s) => s.status === 'active' || s.status === 'trial').length,
    };
  });

  readonly unacknowledgedAlertCount = computed(
    () => this.alertsSignal().filter((a) => !a.acknowledged).length,
  );

  getSubscription(id: string): SubscriptionRecord | undefined {
    return this.subscriptionsSignal().find((s) => s.id === id);
  }

  getInvoice(id: string): InvoiceRecord | undefined {
    return this.invoicesSignal().find((i) => i.id === id);
  }

  getPlan(id: string): SubscriptionPlan | undefined {
    return MOCK_PLANS.find((p) => p.id === id);
  }

  acknowledgeAlert(id: string): void {
    this.alertsSignal.update((list) =>
      list.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
  }

  updateBillingAddress(draft: BillingAddressDraft): void {
    this.billingAddressSignal.set({ ...draft });
  }
}
