import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicCtaAction, PublicTrustBadge } from '../../../models/public-section.model';
import { ConversionCtaLinkComponent } from '../../conversion/conversion-cta-link/conversion-cta-link.component';

@Component({
  selector: 'app-public-cta-section',
  imports: [ConversionCtaLinkComponent, RevealOnScrollDirective],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicCtaSectionComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly primaryCta = input.required<PublicCtaAction>();
  readonly secondaryCta = input<PublicCtaAction | undefined>(undefined);
  readonly trustBadges = input<readonly PublicTrustBadge[]>([]);
}
