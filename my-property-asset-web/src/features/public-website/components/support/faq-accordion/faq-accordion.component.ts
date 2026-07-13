import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicFaqItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-faq-accordion',
  imports: [RevealOnScrollDirective],
  templateUrl: './faq-accordion.component.html',
  styleUrl: './faq-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqAccordionComponent {
  readonly items = input.required<readonly PublicFaqItem[]>();
  readonly groupLabel = input<string | undefined>(undefined);
}
