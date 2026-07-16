import { Injectable } from '@angular/core';

import {
  DEFAULT_PLANS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_SUBSCRIPTIONS,
} from '../config/subscription.config';
import {
  OrganizationSubscription,
  SubscriptionInvoice,
  SubscriptionPayment,
  SubscriptionPlanRecord,
  SubscriptionStatus,
} from '../models/subscription.model';
import { SubscriptionRepository } from './subscription.repository';

@Injectable({ providedIn: 'root' })
export class InMemorySubscriptionRepository extends SubscriptionRepository {
  private plans = [...DEFAULT_PLANS];
  private subscriptions = [...MOCK_SUBSCRIPTIONS];
  private invoices = [...MOCK_INVOICES];
  private payments = [...MOCK_PAYMENTS];

  listPlans(includeInactive = false): readonly SubscriptionPlanRecord[] {
    return this.plans
      .filter((plan) => includeInactive || plan.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getPlanById(id: string): SubscriptionPlanRecord | undefined {
    return this.plans.find((plan) => plan.id === id);
  }

  upsertPlan(plan: SubscriptionPlanRecord): SubscriptionPlanRecord {
    const existing = this.plans.findIndex((item) => item.id === plan.id);
    if (existing >= 0) {
      this.plans = this.plans.map((item, index) => (index === existing ? plan : item));
    } else {
      this.plans = [...this.plans, plan];
    }
    return plan;
  }

  deactivatePlan(planId: string): SubscriptionPlanRecord | undefined {
    const plan = this.getPlanById(planId);
    if (!plan) return undefined;
    const updated = { ...plan, active: false };
    this.plans = this.plans.map((item) => (item.id === planId ? updated : item));
    return updated;
  }

  getActiveSubscription(organizationId: string): OrganizationSubscription | undefined {
    return this.subscriptions.find(
      (item) =>
        item.organizationId === organizationId &&
        (item.status === 'trial' || item.status === 'active' || item.status === 'pending_payment'),
    );
  }

  listSubscriptions(organizationId?: string): readonly OrganizationSubscription[] {
    return organizationId
      ? this.subscriptions.filter((item) => item.organizationId === organizationId)
      : this.subscriptions;
  }

  assignPlan(
    organizationId: string,
    planId: string,
    status: SubscriptionStatus = 'active',
    trialDays?: number,
  ): OrganizationSubscription {
    const plan = this.getPlanById(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    this.subscriptions = this.subscriptions.map((item) =>
      item.organizationId === organizationId &&
      (item.status === 'trial' || item.status === 'active' || item.status === 'pending_payment')
        ? { ...item, status: 'cancelled', cancelledAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        : item,
    );

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + (plan.billingInterval === 'annual' ? 12 : 1));
    const trialEnd =
      status === 'trial'
        ? new Date(now.getTime() + ((trialDays ?? plan.trialDays) || 14) * 24 * 60 * 60 * 1000)
        : undefined;

    const record: OrganizationSubscription = {
      id: `sub-${crypto.randomUUID().slice(0, 8)}`,
      organizationId,
      planId: plan.id,
      planCode: plan.code,
      planName: plan.name,
      status,
      billingInterval: plan.billingInterval,
      currency: plan.currency,
      amountMinor:
        plan.billingInterval === 'annual' ? plan.annualPriceMinor : plan.monthlyPriceMinor,
      startedAt: now.toISOString(),
      trialEndsAt: trialEnd?.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: (trialEnd ?? periodEnd).toISOString(),
      renewsAt: (trialEnd ?? periodEnd).toISOString(),
      updatedAt: now.toISOString(),
    };
    this.subscriptions = [record, ...this.subscriptions];
    return record;
  }

  upgrade(organizationId: string, planId: string): OrganizationSubscription | undefined {
    return this.assignPlan(organizationId, planId, 'active');
  }

  renew(organizationId: string): OrganizationSubscription | undefined {
    const current = this.getActiveSubscription(organizationId);
    if (!current) return undefined;
    const plan = this.getPlanById(current.planId);
    if (!plan) return undefined;

    const start = new Date(current.currentPeriodEnd ?? Date.now());
    const end = new Date(start);
    end.setMonth(end.getMonth() + (current.billingInterval === 'annual' ? 12 : 1));
    const updated: OrganizationSubscription = {
      ...current,
      status: 'active',
      currentPeriodStart: start.toISOString(),
      currentPeriodEnd: end.toISOString(),
      renewsAt: end.toISOString(),
      amountMinor:
        current.billingInterval === 'annual' ? plan.annualPriceMinor : plan.monthlyPriceMinor,
      updatedAt: new Date().toISOString(),
    };
    this.subscriptions = this.subscriptions.map((item) => (item.id === current.id ? updated : item));
    this.generateInvoice(organizationId);
    return updated;
  }

  suspend(organizationId: string, notes?: string): OrganizationSubscription | undefined {
    const current = this.getActiveSubscription(organizationId);
    if (!current) return undefined;
    const updated: OrganizationSubscription = {
      ...current,
      status: 'suspended',
      suspendedAt: new Date().toISOString(),
      notes: notes ?? current.notes,
      updatedAt: new Date().toISOString(),
    };
    this.subscriptions = this.subscriptions.map((item) => (item.id === current.id ? updated : item));
    return updated;
  }

  reactivate(organizationId: string): OrganizationSubscription | undefined {
    const current = this.subscriptions.find(
      (item) => item.organizationId === organizationId && item.status === 'suspended',
    );
    if (!current) return undefined;
    const updated: OrganizationSubscription = {
      ...current,
      status: 'active',
      suspendedAt: undefined,
      updatedAt: new Date().toISOString(),
    };
    this.subscriptions = this.subscriptions.map((item) => (item.id === current.id ? updated : item));
    return updated;
  }

  extendTrial(organizationId: string, days: number): OrganizationSubscription | undefined {
    const current = this.getActiveSubscription(organizationId);
    if (!current) return undefined;
    const base = new Date(current.trialEndsAt ?? current.renewsAt ?? Date.now());
    base.setDate(base.getDate() + days);
    const updated: OrganizationSubscription = {
      ...current,
      status: 'trial',
      trialEndsAt: base.toISOString(),
      renewsAt: base.toISOString(),
      currentPeriodEnd: base.toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.subscriptions = this.subscriptions.map((item) => (item.id === current.id ? updated : item));
    return updated;
  }

  cancel(organizationId: string): OrganizationSubscription | undefined {
    const current = this.getActiveSubscription(organizationId);
    if (!current) return undefined;
    const updated: OrganizationSubscription = {
      ...current,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.subscriptions = this.subscriptions.map((item) => (item.id === current.id ? updated : item));
    return updated;
  }

  listInvoices(organizationId: string): readonly SubscriptionInvoice[] {
    return this.invoices.filter((item) => item.organizationId === organizationId);
  }

  getInvoice(id: string): SubscriptionInvoice | undefined {
    return this.invoices.find((item) => item.id === id);
  }

  generateInvoice(organizationId: string): SubscriptionInvoice | undefined {
    const subscription = this.getActiveSubscription(organizationId);
    if (!subscription) return undefined;
    const tax = Math.round(subscription.amountMinor * 0.18);
    const invoice: SubscriptionInvoice = {
      id: `inv-${crypto.randomUUID().slice(0, 8)}`,
      organizationId,
      subscriptionId: subscription.id,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(this.invoices.length + 1002).padStart(4, '0')}`,
      status: 'open',
      currency: subscription.currency,
      subtotalMinor: subscription.amountMinor,
      taxMinor: tax,
      totalMinor: subscription.amountMinor + tax,
      issuedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `${subscription.planName} ${subscription.billingInterval} renewal`,
    };
    this.invoices = [invoice, ...this.invoices];
    return invoice;
  }

  listPayments(organizationId: string): readonly SubscriptionPayment[] {
    return this.payments.filter((item) => item.organizationId === organizationId);
  }
}
