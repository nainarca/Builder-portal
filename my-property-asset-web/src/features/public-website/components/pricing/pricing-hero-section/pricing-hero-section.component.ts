import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { PublicCtaAction } from '../../../models/public-section.model';
import { PublicAnalyticsService } from '../../../services/public-analytics.service';

@Component({
  selector: 'app-pricing-hero-section',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './pricing-hero-section.component.html',
  styleUrl: './pricing-hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingHeroSectionComponent {
  private readonly analytics = inject(PublicAnalyticsService);

  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly primaryCta = input.required<PublicCtaAction>();

  trackCta(action: PublicCtaAction): void {
    if (action.analyticsName) {
      this.analytics.trackCta(action.analyticsName);
    }
  }
}
