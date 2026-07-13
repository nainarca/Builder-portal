import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardKpiItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-sa-kpi-card',
  template: `
    <article class="sa-kpi-card" [attr.aria-label]="item().label">
      <div class="sa-kpi-card__header">
        <p class="sa-kpi-card__label">{{ item().label }}</p>
        <span class="sa-kpi-card__icon" [class]="iconToneClass()">
          <i [class]="item().icon" aria-hidden="true"></i>
        </span>
      </div>
      <p class="sa-kpi-card__value">{{ item().value }}</p>
      @if (item().hint) {
        <p class="sa-kpi-card__hint">{{ item().hint }}</p>
      }
      @if (item().trendLabel) {
        <span class="sa-kpi-card__trend" [class]="trendClass()">
          @if (item().trend === 'up') {
            <i class="pi pi-arrow-up" aria-hidden="true"></i>
          } @else if (item().trend === 'down') {
            <i class="pi pi-arrow-down" aria-hidden="true"></i>
          }
          {{ item().trendLabel }}
        </span>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  readonly item = input.required<DashboardKpiItem>();

  readonly iconToneClass = computed(
    () => `sa-kpi-card__icon--${this.item().tone ?? 'neutral'}`,
  );

  readonly trendClass = computed(
    () => `sa-kpi-card__trend--${this.item().trend ?? 'neutral'}`,
  );
}
