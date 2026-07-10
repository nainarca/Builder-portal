import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicTestimonialItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-testimonials-section',
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicTestimonialsSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Testimonials');
  readonly title = input.required<string>();
  readonly testimonials = input.required<readonly PublicTestimonialItem[]>();
}
