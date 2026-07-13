import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardMetricItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-sa-metric-card',
  template: `
    <article class="sa-metric-card" [attr.aria-label]="item().label">
      <p class="sa-metric-card__label">{{ item().label }}</p>
      <p class="sa-metric-card__value">
        {{ item().value }}
        @if (item().unit) {
          <span class="sa-metric-card__unit">{{ item().unit }}</span>
        }
      </p>
      @if (item().description) {
        <p class="sa-metric-card__description">{{ item().description }}</p>
      }
    </article>
  `,
  styles: `
    .sa-metric-card__unit {
      margin-left: 0.2rem;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-normal);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCardComponent {
  readonly item = input.required<DashboardMetricItem>();
}
