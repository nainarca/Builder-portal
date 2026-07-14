export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'canceled' | 'expired' | 'pending';
export type PlanTier = 'starter' | 'growth' | 'business' | 'enterprise';
export type BillingInterval = 'monthly' | 'annual';
export type InvoiceStatus = 'paid' | 'open' | 'draft' | 'void' | 'past_due';
export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'not_configured';
export type LicenseStatus = 'active' | 'exhausted' | 'expiring' | 'revoked';
export type CommercialAlertType =
  | 'trial_expiry'
  | 'subscription_expiry'
  | 'renewal_reminder'
  | 'payment_due'
  | 'license_exhaustion'
  | 'upgrade_recommendation';
export type UsageMetricKey =
  | 'organizations'
  | 'users'
  | 'storage'
  | 'projects'
  | 'units'
  | 'api';
export type PaymentProviderId =
  | 'stripe'
  | 'razorpay'
  | 'paddle'
  | 'cashfree'
  | 'phonepe'
  | 'enterprise';

export type BillingSectionId =
  | 'dashboard'
  | 'plans'
  | 'billing'
  | 'licenses'
  | 'usage'
  | 'notifications';

export interface PlanFeature {
  readonly id: string;
  readonly label: string;
  readonly included: boolean;
  readonly highlight?: boolean;
}

export interface SubscriptionPlan {
  readonly id: string;
  readonly tier: PlanTier;
  readonly name: string;
  readonly description: string;
  readonly monthlyPrice: number;
  readonly annualPrice: number;
  readonly currency: string;
  readonly popular?: boolean;
  readonly enterprise?: boolean;
  readonly features: readonly PlanFeature[];
  readonly limits: {
    readonly organizations: number;
    readonly users: number;
    readonly storageGb: number;
    readonly projects: number;
    readonly units: number;
    readonly apiCalls: number;
  };
}

export interface SubscriptionRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly organizationName: string;
  readonly builderId?: string;
  readonly builderName?: string;
  readonly planId: string;
  readonly planName: string;
  readonly tier: PlanTier;
  readonly status: SubscriptionStatus;
  readonly interval: BillingInterval;
  readonly amount: number;
  readonly currency: string;
  readonly startDate: string;
  readonly renewsAt: string;
  readonly trialEndsAt?: string;
  readonly canceledAt?: string;
  readonly seats: number;
  readonly seatsUsed: number;
}

export interface InvoiceLineItem {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitAmount: number;
  readonly amount: number;
}

export interface InvoiceRecord {
  readonly id: string;
  readonly number: string;
  readonly subscriptionId: string;
  readonly organizationName: string;
  readonly status: InvoiceStatus;
  readonly paymentStatus: PaymentStatus;
  readonly currency: string;
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
  readonly issuedAt: string;
  readonly dueAt: string;
  readonly paidAt?: string;
  readonly billingAddress: {
    readonly line1: string;
    readonly city: string;
    readonly region: string;
    readonly postalCode: string;
    readonly country: string;
  };
  readonly taxId?: string;
  readonly lines: readonly InvoiceLineItem[];
}

export interface LicensePool {
  readonly id: string;
  readonly organizationId: string;
  readonly organizationName: string;
  readonly product: string;
  readonly status: LicenseStatus;
  readonly allocated: number;
  readonly used: number;
  readonly available: number;
  readonly expiresAt: string;
}

export interface UsageMetric {
  readonly key: UsageMetricKey;
  readonly label: string;
  readonly used: number;
  readonly limit: number;
  readonly unit: string;
  readonly placeholder?: boolean;
}

export interface CommercialAlert {
  readonly id: string;
  readonly type: CommercialAlertType;
  readonly title: string;
  readonly message: string;
  readonly severity: 'info' | 'warning' | 'critical';
  readonly organizationName: string;
  readonly createdAt: string;
  readonly acknowledged: boolean;
  readonly actionLabel?: string;
  readonly actionRoute?: string;
}

export interface SubscriptionTimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly kind: 'plan' | 'invoice' | 'license' | 'trial' | 'renewal';
}

export interface PaymentProviderPlaceholder {
  readonly id: PaymentProviderId;
  readonly name: string;
  readonly description: string;
  readonly status: 'planned' | 'coming_soon' | 'enterprise_only';
  readonly icon: string;
}

export interface BillingAddressDraft {
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  taxId: string;
}

export interface CommercialOverview {
  readonly activeSubscriptions: number;
  readonly trialCount: number;
  readonly pastDueCount: number;
  readonly mrr: number;
  readonly currency: string;
  readonly licenseUtilization: number;
  readonly upcomingRenewals: number;
}
