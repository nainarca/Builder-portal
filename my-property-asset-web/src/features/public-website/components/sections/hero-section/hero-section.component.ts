import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PublicCtaAction } from '../../../models/public-section.model';
import { ConversionCtaLinkComponent } from '../../conversion/conversion-cta-link/conversion-cta-link.component';

@Component({
  selector: 'app-public-hero-section',
  imports: [ConversionCtaLinkComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHeroSectionComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly highlights = input<readonly string[]>([]);
  readonly primaryCta = input.required<PublicCtaAction>();
  readonly secondaryCta = input<PublicCtaAction | undefined>(undefined);
  readonly logoSrc = input<string | undefined>(undefined);
  readonly logoAlt = input('MyPropertyAsset');

  readonly titleWords = computed(() => this.title().split(' '));
}
