export type PlanTier = 'free_trial' | 'starter' | 'professional' | 'enterprise' | 'custom';

export type SubscriptionStatus =
  | 'trial'
  | 'active'
  | 'expired'
  | 'suspended'
  | 'cancelled'
  | 'pending_payment';

export type BillingInterval = 'monthly' | 'annual' | 'custom';

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'past_due';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export type EnforceableAction =
  | 'create_project'
  | 'create_unit'
  | 'invite_staff'
  | 'upload_document'
  | 'send_communication';

export interface PlanLimits {
  readonly projects: number;
  readonly buildings: number;
  readonly units: number;
  readonly owners: number;
  readonly staff: number;
  readonly storageGb: number;
  readonly monthlyNotifications: number;
  readonly whiteLabel: boolean;
  readonly advancedReports: boolean;
  readonly prioritySupport: boolean;
  readonly apiAccess: boolean;
  readonly customDomain: boolean;
}

export interface SubscriptionPlanRecord {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly tier: PlanTier;
  readonly billingInterval: BillingInterval;
  readonly currency: string;
  readonly monthlyPriceMinor: number;
  readonly annualPriceMinor: number;
  readonly active: boolean;
  readonly public: boolean;
  readonly trialDays: number;
  readonly limits: PlanLimits;
  readonly features: readonly string[];
  readonly sortOrder: number;
}

export interface OrganizationSubscription {
  readonly id: string;
  readonly organizationId: string;
  readonly planId: string;
  readonly planCode: string;
  readonly planName: string;
  readonly status: SubscriptionStatus;
  readonly billingInterval: BillingInterval;
  readonly currency: string;
  readonly amountMinor: number;
  readonly startedAt: string;
  readonly trialEndsAt?: string;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd?: string;
  readonly renewsAt?: string;
  readonly cancelledAt?: string;
  readonly suspendedAt?: string;
  readonly notes?: string;
  readonly updatedAt: string;
}

export interface SubscriptionInvoice {
  readonly id: string;
  readonly organizationId: string;
  readonly subscriptionId: string;
  readonly invoiceNumber: string;
  readonly status: InvoiceStatus;
  readonly currency: string;
  readonly subtotalMinor: number;
  readonly taxMinor: number;
  readonly totalMinor: number;
  readonly issuedAt?: string;
  readonly dueAt?: string;
  readonly paidAt?: string;
  readonly pdfUrl?: string;
  readonly notes?: string;
}

export interface SubscriptionPayment {
  readonly id: string;
  readonly organizationId: string;
  readonly subscriptionId: string;
  readonly invoiceId?: string;
  readonly amountMinor: number;
  readonly currency: string;
  readonly paymentStatus: PaymentStatus;
  readonly paymentMethod?: string;
  readonly transactionReference?: string;
  readonly providerCode?: string;
  readonly paidAt?: string;
  readonly notes?: string;
  readonly createdAt: string;
}

export interface UsageSnapshot {
  readonly projects: number;
  readonly buildings: number;
  readonly units: number;
  readonly owners: number;
  readonly staff: number;
  readonly storageGb: number;
  readonly monthlyNotifications: number;
}

export interface LimitCheckResult {
  readonly allowed: boolean;
  readonly action: EnforceableAction;
  readonly reason?: string;
  readonly upgradeRequired: boolean;
  readonly currentUsage?: number;
  readonly limit?: number;
}

export interface SubscriptionSummary {
  readonly subscription: OrganizationSubscription | null;
  readonly plan: SubscriptionPlanRecord | null;
  readonly usage: UsageSnapshot;
  readonly remaining: Partial<Record<keyof PlanLimits, number | boolean>>;
  readonly daysUntilExpiry: number | null;
}

export interface PaymentIntentRequest {
  readonly organizationId: string;
  readonly subscriptionId: string;
  readonly amountMinor: number;
  readonly currency: string;
  readonly description: string;
}

export interface PaymentIntentResult {
  readonly providerCode: string;
  readonly intentId: string;
  readonly status: 'created' | 'not_configured';
  readonly checkoutUrl?: string;
  readonly message: string;
}
