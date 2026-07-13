import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardStatusItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-sa-status-card',
  template: `
    <article class="sa-status-card" [attr.aria-label]="item().label">
      <span class="sa-status-card__icon">
        <i [class]="item().icon" aria-hidden="true"></i>
      </span>
      <div class="sa-status-card__content">
        <p class="sa-status-card__label">{{ item().label }}</p>
        <p class="sa-status-card__detail">{{ item().detail }}</p>
      </div>
      <span class="sa-status-card__badge" [class]="badgeClass()">{{ item().status }}</span>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusCardComponent {
  readonly item = input.required<DashboardStatusItem>();

  badgeClass(): string {
    return `sa-status-card__badge--${this.item().status}`;
  }
}
