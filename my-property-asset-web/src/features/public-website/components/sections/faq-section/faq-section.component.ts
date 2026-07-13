import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicFaqItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-faq-section',
  imports: [RevealOnScrollDirective],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFaqSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('FAQ');
  readonly title = input.required<string>();
  readonly items = input.required<readonly PublicFaqItem[]>();
}
