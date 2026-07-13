import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PricingBillingService } from '../../../services/pricing-billing.service';
import { BillingPeriod } from '../../../models/pricing.model';

@Component({
  selector: 'app-pricing-toggle',
  templateUrl: './pricing-toggle.component.html',
  styleUrl: './pricing-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingToggleComponent {
  private readonly billing = inject(PricingBillingService);

  readonly period = this.billing.period;
  readonly discountLabel = this.billing.discountLabel;

  select(period: BillingPeriod): void {
    this.billing.setPeriod(period);
  }

  isActive(period: BillingPeriod): boolean {
    return this.period() === period;
  }
}
