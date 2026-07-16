import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  ManualPaymentGatewayProvider,
  PAYMENT_GATEWAY_PROVIDER,
  PaymentGatewayProvider,
} from './payment-gateway.provider';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { InMemorySubscriptionRepository } from '../repositories/in-memory-subscription.repository';

export function provideBuilderSubscription(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SubscriptionRepository, useExisting: InMemorySubscriptionRepository },
    { provide: PaymentGatewayProvider, useClass: ManualPaymentGatewayProvider },
    { provide: PAYMENT_GATEWAY_PROVIDER, useExisting: PaymentGatewayProvider },
  ]);
}
