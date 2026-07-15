import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardSummaryItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-bp-summary-card',
  template: `
    <article class="bp-summary-card" [attr.aria-label]="item().title">
      <div class="bp-summary-card__header">
        <i class="bp-summary-card__icon" [class]="item().icon" aria-hidden="true"></i>
        <p class="bp-summary-card__title">{{ item().title }}</p>
      </div>
      <p class="bp-summary-card__value">{{ item().value }}</p>
      <p class="bp-summary-card__subtitle">{{ item().subtitle }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  readonly item = input.required<DashboardSummaryItem>();
}
