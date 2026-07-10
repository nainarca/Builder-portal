import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { PublicPricingTier } from '../../../models/public-section.model';
import { PublicAnalyticsService } from '../../../services/public-analytics.service';

@Component({
  selector: 'app-public-pricing-preview-section',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './pricing-preview-section.component.html',
  styleUrl: './pricing-preview-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicPricingPreviewSectionComponent {
  private readonly analytics = inject(PublicAnalyticsService);

  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Pricing preview');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tiers = input.required<readonly PublicPricingTier[]>();

  trackTier(tier: PublicPricingTier): void {
    this.analytics.trackCta(`public_pricing_${tier.id}`);
  }
}
