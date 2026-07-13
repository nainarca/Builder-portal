import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PricingTrustHighlight } from '../../../models/pricing.model';

@Component({
  selector: 'app-pricing-trust-section',
  imports: [RevealOnScrollDirective],
  templateUrl: './pricing-trust-section.component.html',
  styleUrl: './pricing-trust-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingTrustSectionComponent {
  readonly sectionId = input.required<string>();
  readonly title = input('Buy with confidence');
  readonly highlights = input.required<readonly PricingTrustHighlight[]>();
}
