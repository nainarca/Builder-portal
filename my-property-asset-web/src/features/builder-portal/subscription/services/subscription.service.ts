import { Injectable, computed, inject } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';
import { formatMoney } from '../config/subscription.config';
import {
  OrganizationSubscription,
  SubscriptionInvoice,
  SubscriptionPayment,
  SubscriptionPlanRecord,
  SubscriptionSummary,
} from '../models/subscription.model';
import { PaymentGatewayProvider } from '../providers/payment-gateway.provider';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { PlanEnforcementService } from './plan-enforcement.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly repository = inject(SubscriptionRepository);
  private readonly enforcement = inject(PlanEnforcementService);
  private readonly paymentGateway = inject(PaymentGatewayProvider);
  private readonly currentOrganization = inject(CurrentOrganizationService);

  readonly summary = computed<SubscriptionSummary>(() => {
    const organizationId = this.resolveOrganizationId();
    const subscription = this.repository.getActiveSubscription(organizationId) ?? null;
    const plan = subscription ? this.repository.getPlanById(subscription.planId) ?? null : null;
    const usage = this.enforcement.usage();
    const remaining = this.enforcement.remainingLimits();
    const expiry = subscription?.renewsAt ?? subscription?.trialEndsAt ?? subscription?.currentPeriodEnd;
    const daysUntilExpiry = expiry
      ? Math.ceil((new Date(expiry).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      : null;
    return { subscription, plan, usage, remaining, daysUntilExpiry };
  });

  listPublicPlans(): readonly SubscriptionPlanRecord[] {
    return this.repository.listPlans().filter((plan) => plan.public && plan.active);
  }

  listAllPlans(): readonly SubscriptionPlanRecord[] {
    return this.repository.listPlans(true);
  }

  getActiveSubscription(organizationId = this.resolveOrganizationId()): OrganizationSubscription | undefined {
    return this.repository.getActiveSubscription(organizationId);
  }

  listInvoices(organizationId = this.resolveOrganizationId()): readonly SubscriptionInvoice[] {
    return this.repository.listInvoices(organizationId);
  }

  getInvoice(id: string): SubscriptionInvoice | undefined {
    return this.repository.getInvoice(id);
  }

  listPayments(organizationId = this.resolveOrganizationId()): readonly SubscriptionPayment[] {
    return this.repository.listPayments(organizationId);
  }

  upgrade(planId: string): OrganizationSubscription | undefined {
    return this.repository.upgrade(this.resolveOrganizationId(), planId);
  }

  renew(): OrganizationSubscription | undefined {
    return this.repository.renew(this.resolveOrganizationId());
  }

  startTrial(planId = 'plan-free-trial'): OrganizationSubscription {
    return this.repository.assignPlan(this.resolveOrganizationId(), planId, 'trial');
  }

  generateInvoice(): SubscriptionInvoice | undefined {
    return this.repository.generateInvoice(this.resolveOrganizationId());
  }

  async beginRenewalCheckout(): Promise<{ message: string; intentId?: string }> {
    const subscription = this.getActiveSubscription();
    if (!subscription) {
      return { message: 'No active subscription found.' };
    }
    const intent = await this.paymentGateway.createPaymentIntent({
      organizationId: subscription.organizationId,
      subscriptionId: subscription.id,
      amountMinor: subscription.amountMinor,
      currency: subscription.currency,
      description: `Renew ${subscription.planName}`,
    });
    return { message: intent.message, intentId: intent.intentId };
  }

  // Super Admin operations
  assignPlan(organizationId: string, planId: string, status: 'trial' | 'active' = 'active') {
    return this.repository.assignPlan(organizationId, planId, status);
  }

  suspend(organizationId: string, notes?: string) {
    return this.repository.suspend(organizationId, notes);
  }

  reactivate(organizationId: string) {
    return this.repository.reactivate(organizationId);
  }

  extendTrial(organizationId: string, days: number) {
    return this.repository.extendTrial(organizationId, days);
  }

  deactivatePlan(planId: string) {
    return this.repository.deactivatePlan(planId);
  }

  upsertPlan(plan: SubscriptionPlanRecord) {
    return this.repository.upsertPlan(plan);
  }

  listAllSubscriptions() {
    return this.repository.listSubscriptions();
  }

  formatAmount(amountMinor: number, currency = 'INR'): string {
    return formatMoney(amountMinor, currency);
  }

  private resolveOrganizationId(): string {
    return this.currentOrganization.organizationId() ?? 'org-builder-demo';
  }
}
