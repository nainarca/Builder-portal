import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '@shared/ui';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicFeatureItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-features-section',
  imports: [IconComponent, RevealOnScrollDirective],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFeaturesSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Platform capabilities');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly features = input.required<readonly PublicFeatureItem[]>();
}
