/**
 * P15 Subscription & Billing — API contracts (Angular layer / future REST mapping)
 *
 * These contracts describe the intended backend surface. The Angular app currently
 * uses in-memory repositories that mirror this shape.
 */

export interface PlanListResponse {
  items: Array<{
    id: string;
    code: string;
    name: string;
    tier: string;
    monthlyPriceMinor: number;
    annualPriceMinor: number;
    limits: Record<string, number | boolean>;
    features: string[];
    active: boolean;
  }>;
}

export interface SubscriptionResponse {
  id: string;
  organizationId: string;
  planId: string;
  status: 'trial' | 'active' | 'expired' | 'suspended' | 'cancelled' | 'pending_payment';
  renewsAt?: string;
  trialEndsAt?: string;
  amountMinor: number;
  currency: string;
}

export interface UsageResponse {
  organizationId: string;
  usage: {
    projects: number;
    buildings: number;
    units: number;
    owners: number;
    staff: number;
    storageGb: number;
    monthlyNotifications: number;
  };
  remaining: Record<string, number | boolean>;
}

export interface InvoiceListResponse {
  items: Array<{
    id: string;
    invoiceNumber: string;
    status: string;
    totalMinor: number;
    currency: string;
    issuedAt?: string;
    pdfUrl?: string;
  }>;
}

export interface PaymentListResponse {
  items: Array<{
    id: string;
    amountMinor: number;
    currency: string;
    paymentStatus: string;
    paymentMethod?: string;
    transactionReference?: string;
    paidAt?: string;
  }>;
}

export interface PaymentIntentRequestBody {
  organizationId: string;
  subscriptionId: string;
  amountMinor: number;
  currency: string;
  description: string;
}

export interface PaymentIntentResponseBody {
  providerCode: string;
  intentId: string;
  status: 'created' | 'not_configured';
  checkoutUrl?: string;
  message: string;
}

/** Suggested REST routes (not wired in V1 Angular mock mode) */
export const SUBSCRIPTION_API_ROUTES = {
  plans: 'GET /api/v1/billing/plans',
  planCreate: 'POST /api/v1/billing/plans',
  planUpdate: 'PATCH /api/v1/billing/plans/:planId',
  planDeactivate: 'POST /api/v1/billing/plans/:planId/deactivate',
  subscription: 'GET /api/v1/organizations/:orgId/subscription',
  assign: 'POST /api/v1/organizations/:orgId/subscription/assign',
  upgrade: 'POST /api/v1/organizations/:orgId/subscription/upgrade',
  renew: 'POST /api/v1/organizations/:orgId/subscription/renew',
  suspend: 'POST /api/v1/organizations/:orgId/subscription/suspend',
  reactivate: 'POST /api/v1/organizations/:orgId/subscription/reactivate',
  extendTrial: 'POST /api/v1/organizations/:orgId/subscription/extend-trial',
  usage: 'GET /api/v1/organizations/:orgId/subscription/usage',
  invoices: 'GET /api/v1/organizations/:orgId/invoices',
  invoiceGenerate: 'POST /api/v1/organizations/:orgId/invoices',
  invoicePdf: 'GET /api/v1/organizations/:orgId/invoices/:invoiceId/pdf',
  payments: 'GET /api/v1/organizations/:orgId/payments',
  paymentIntent: 'POST /api/v1/billing/payment-intents',
} as const;
