import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardKpiItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-bp-kpi-card',
  template: `
    <article class="bp-kpi-card" [attr.aria-label]="item().label">
      <div class="bp-kpi-card__header">
        <p class="bp-kpi-card__label">{{ item().label }}</p>
        <span class="bp-kpi-card__icon" [class]="iconToneClass()">
          <i [class]="item().icon" aria-hidden="true"></i>
        </span>
      </div>
      <p class="bp-kpi-card__value">{{ item().value }}</p>
      @if (item().hint) {
        <p class="bp-kpi-card__hint">{{ item().hint }}</p>
      }
      @if (item().trendLabel) {
        <span class="bp-kpi-card__trend" [class]="trendClass()">
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

  readonly iconToneClass = computed(() => `bp-kpi-card__icon--${this.item().tone ?? 'neutral'}`);

  readonly trendClass = computed(() => `bp-kpi-card__trend--${this.item().trend ?? 'neutral'}`);
}
