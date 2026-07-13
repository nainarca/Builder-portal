import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PricingPlan } from '../../../models/pricing.model';
import { PublicAnalyticsService } from '../../../services/public-analytics.service';
import { PricingCardComponent } from '../pricing-card/pricing-card.component';
import { PricingToggleComponent } from '../pricing-toggle/pricing-toggle.component';

@Component({
  selector: 'app-pricing-plans-section',
  imports: [PricingToggleComponent, PricingCardComponent, RevealOnScrollDirective],
  templateUrl: './pricing-plans-section.component.html',
  styleUrl: './pricing-plans-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlansSectionComponent {
  private readonly analytics = inject(PublicAnalyticsService);

  readonly sectionId = input.required<string>();
  readonly plans = input.required<readonly PricingPlan[]>();

  trackPlan(plan: PricingPlan): void {
    if (plan.ctaAnalyticsName) {
      this.analytics.trackCta(plan.ctaAnalyticsName);
    }
  }
}
