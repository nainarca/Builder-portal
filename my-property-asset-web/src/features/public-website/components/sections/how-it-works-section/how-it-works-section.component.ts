import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicStepItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-how-it-works-section',
  templateUrl: './how-it-works-section.component.html',
  styleUrl: './how-it-works-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHowItWorksSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('How it works');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly steps = input.required<readonly PublicStepItem[]>();
}
