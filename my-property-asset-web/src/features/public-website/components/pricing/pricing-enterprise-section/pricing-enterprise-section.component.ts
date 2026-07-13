import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PricingEnterpriseOffer } from '../../../models/pricing.model';
import { PublicAnalyticsService } from '../../../services/public-analytics.service';

@Component({
  selector: 'app-pricing-enterprise-section',
  imports: [RouterLink, ButtonComponent, RevealOnScrollDirective],
  templateUrl: './pricing-enterprise-section.component.html',
  styleUrl: './pricing-enterprise-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingEnterpriseSectionComponent {
  private readonly analytics = inject(PublicAnalyticsService);

  readonly sectionId = input.required<string>();
  readonly offer = input.required<PricingEnterpriseOffer>();

  trackCta(): void {
    const offer = this.offer();
    if (offer.ctaAnalyticsName) {
      this.analytics.trackCta(offer.ctaAnalyticsName);
    }
  }
}
