import {
  OrganizationSubscription,
  SubscriptionInvoice,
  SubscriptionPayment,
  SubscriptionPlanRecord,
  SubscriptionStatus,
} from '../models/subscription.model';

export abstract class SubscriptionRepository {
  abstract listPlans(includeInactive?: boolean): readonly SubscriptionPlanRecord[];
  abstract getPlanById(id: string): SubscriptionPlanRecord | undefined;
  abstract upsertPlan(plan: SubscriptionPlanRecord): SubscriptionPlanRecord;
  abstract deactivatePlan(planId: string): SubscriptionPlanRecord | undefined;

  abstract getActiveSubscription(organizationId: string): OrganizationSubscription | undefined;
  abstract listSubscriptions(organizationId?: string): readonly OrganizationSubscription[];
  abstract assignPlan(
    organizationId: string,
    planId: string,
    status?: SubscriptionStatus,
    trialDays?: number,
  ): OrganizationSubscription;
  abstract upgrade(organizationId: string, planId: string): OrganizationSubscription | undefined;
  abstract renew(organizationId: string): OrganizationSubscription | undefined;
  abstract suspend(organizationId: string, notes?: string): OrganizationSubscription | undefined;
  abstract reactivate(organizationId: string): OrganizationSubscription | undefined;
  abstract extendTrial(organizationId: string, days: number): OrganizationSubscription | undefined;
  abstract cancel(organizationId: string): OrganizationSubscription | undefined;

  abstract listInvoices(organizationId: string): readonly SubscriptionInvoice[];
  abstract getInvoice(id: string): SubscriptionInvoice | undefined;
  abstract generateInvoice(organizationId: string): SubscriptionInvoice | undefined;

  abstract listPayments(organizationId: string): readonly SubscriptionPayment[];
}
