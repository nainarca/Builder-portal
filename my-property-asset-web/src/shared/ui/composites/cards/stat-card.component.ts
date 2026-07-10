import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatCardData } from '../../models';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-stat-card',
  imports: [CardComponent],
  template: `
    <app-card variant="flat">
      <p class="ui-stat-card__label">{{ data().label }}</p>
      <p class="ui-stat-card__value">{{ data().value }}</p>
      @if (data().hint || data().trendLabel) {
        <p class="ui-stat-card__hint">
          @if (data().trendLabel) {
            <span>{{ data().trendLabel }}</span>
          }
          @if (data().hint) {
            <span>{{ data().hint }}</span>
          }
        </p>
      }
    </app-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly data = input.required<StatCardData>();
}
