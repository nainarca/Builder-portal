import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardTrendItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-sa-trend-card',
  template: `
    <article class="sa-trend-card" [attr.aria-label]="item().label">
      <p class="sa-kpi-card__label">{{ item().label }}</p>
      <p class="sa-trend-card__value">{{ item().value }}</p>
      <span class="sa-trend-card__change" [class]="changeClass()">{{ item().change }}</span>
      <p class="sa-trend-card__period">{{ item().period }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendCardComponent {
  readonly item = input.required<DashboardTrendItem>();

  readonly changeClass = computed(
    () => `sa-trend-card__change--${this.item().trend}`,
  );
}
