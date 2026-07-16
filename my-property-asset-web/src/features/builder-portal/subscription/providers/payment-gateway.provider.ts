import { InjectionToken } from '@angular/core';

import { PaymentIntentRequest, PaymentIntentResult } from '../models/subscription.model';

/**
 * Payment gateway abstraction for P15.
 * No live provider is integrated in this phase.
 */
export abstract class PaymentGatewayProvider {
  abstract readonly code: string;
  abstract readonly displayName: string;
  abstract readonly configured: boolean;

  abstract createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult>;
}

export const PAYMENT_GATEWAY_PROVIDER = new InjectionToken<PaymentGatewayProvider>(
  'PAYMENT_GATEWAY_PROVIDER',
);

export class NullPaymentGatewayProvider extends PaymentGatewayProvider {
  readonly code = 'null';
  readonly displayName = 'Not configured';
  readonly configured = false;

  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult> {
    return {
      providerCode: this.code,
      intentId: `intent-${crypto.randomUUID().slice(0, 8)}`,
      status: 'not_configured',
      message: `Payment provider is not configured for ${request.currency} ${request.amountMinor}. Integration pending.`,
    };
  }
}

export class ManualPaymentGatewayProvider extends PaymentGatewayProvider {
  readonly code = 'manual';
  readonly displayName = 'Manual / Offline';
  readonly configured = true;

  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult> {
    return {
      providerCode: this.code,
      intentId: `manual-${crypto.randomUUID().slice(0, 8)}`,
      status: 'created',
      message: `Manual payment intent recorded for invoice of ${request.amountMinor} ${request.currency}.`,
    };
  }
}
