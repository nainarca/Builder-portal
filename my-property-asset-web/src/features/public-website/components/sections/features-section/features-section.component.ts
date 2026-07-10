import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentCardComponent } from '@shared/ui';
import { PublicFeatureItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-features-section',
  imports: [ContentCardComponent],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFeaturesSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Capabilities');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly features = input.required<readonly PublicFeatureItem[]>();
}
