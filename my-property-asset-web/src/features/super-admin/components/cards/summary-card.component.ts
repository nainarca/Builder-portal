import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardSummaryItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-sa-summary-card',
  template: `
    <article class="sa-summary-card" [attr.aria-label]="item().title">
      <div class="sa-summary-card__header">
        <i class="sa-summary-card__icon" [class]="item().icon" aria-hidden="true"></i>
        <p class="sa-summary-card__title">{{ item().title }}</p>
      </div>
      <p class="sa-summary-card__value">{{ item().value }}</p>
      <p class="sa-summary-card__subtitle">{{ item().subtitle }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  readonly item = input.required<DashboardSummaryItem>();
}
