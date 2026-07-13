import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicStatisticItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-stat-highlight-card',
  templateUrl: './stat-highlight-card.component.html',
  styleUrl: './stat-highlight-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatHighlightCardComponent {
  readonly stat = input.required<PublicStatisticItem>();
}
