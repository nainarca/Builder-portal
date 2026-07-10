import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatCardComponent } from '@shared/ui';
import { PublicStatisticItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-statistics-section',
  imports: [StatCardComponent],
  templateUrl: './statistics-section.component.html',
  styleUrl: './statistics-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicStatisticsSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Impact');
  readonly title = input.required<string>();
  readonly statistics = input.required<readonly PublicStatisticItem[]>();
}
