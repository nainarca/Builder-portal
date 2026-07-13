import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { BillingPeriod, PricingPlan } from '../../../models/pricing.model';
import { PricingBillingService } from '../../../services/pricing-billing.service';

@Component({
  selector: 'app-pricing-card',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pricing-card-host--popular]': 'plan().popular',
    '[class.pricing-card-host--recommended]': 'plan().recommended',
  },
})
export class PricingCardComponent {
  private readonly billing = inject(PricingBillingService);

  readonly plan = input.required<PricingPlan>();
  readonly periodOverride = input<BillingPeriod | undefined>(undefined);

  readonly ctaClick = output<PricingPlan>();

  readonly displayPrice = computed(() => {
    const plan = this.plan();
    const period = this.periodOverride() ?? this.billing.period();

    if (plan.prices.customLabel) {
      return plan.prices.customLabel;
    }

    const amount = period === 'annual' ? plan.prices.annual : plan.prices.monthly;
    if (amount === null) {
      return 'Custom';
    }

    if (amount === 0) {
      return '$0';
    }

    return `$${amount}`;
  });

  readonly displayPeriod = computed(() => {
    const plan = this.plan();
    if (plan.prices.customLabel) {
      return 'tailored to your organization';
    }

    const period = this.periodOverride() ?? this.billing.period();
    return period === 'annual' ? 'per month, billed annually' : 'per month';
  });

  onCtaClick(): void {
    this.ctaClick.emit(this.plan());
  }
}
