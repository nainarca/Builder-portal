import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardTrendItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-bp-trend-card',
  template: `
    <article class="bp-trend-card" [attr.aria-label]="item().label">
      <p class="bp-kpi-card__label">{{ item().label }}</p>
      <p class="bp-trend-card__value">{{ item().value }}</p>
      <span class="bp-trend-card__change" [class]="changeClass()">{{ item().change }}</span>
      <p class="bp-trend-card__period">{{ item().period }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendCardComponent {
  readonly item = input.required<DashboardTrendItem>();

  readonly changeClass = computed(() => `bp-trend-card__change--${this.item().trend}`);
}
