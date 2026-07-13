import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicTestimonialItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-testimonials-section',
  imports: [RevealOnScrollDirective],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicTestimonialsSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Customer stories');
  readonly title = input.required<string>();
  readonly testimonials = input.required<readonly PublicTestimonialItem[]>();

  initials(item: PublicTestimonialItem): string {
    return item.initials ?? item.author.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  }
}
