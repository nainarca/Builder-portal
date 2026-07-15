import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardQuickActionItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-bp-quick-action-card',
  template: `
    <button
      type="button"
      class="bp-quick-action-card"
      [attr.aria-label]="action().label"
      (click)="selected.emit(action())"
    >
      <i class="bp-quick-action-card__icon" [class]="action().icon" aria-hidden="true"></i>
      <p class="bp-quick-action-card__label">{{ action().label }}</p>
      <p class="bp-quick-action-card__description">{{ action().description }}</p>
      @if (showBadges()) {
        <div class="bp-quick-action-card__badges">
          @if (pinned()) {
            <span class="bp-quick-action-card__badge bp-quick-action-card__badge--pinned">
              <i class="pi pi-thumbtack" aria-hidden="true"></i> Pinned
            </span>
          }
          @if (favorite()) {
            <span class="bp-quick-action-card__badge bp-quick-action-card__badge--favorite">
              <i class="pi pi-star-fill" aria-hidden="true"></i> Favorite
            </span>
          }
        </div>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionCardComponent {
  readonly action = input.required<DashboardQuickActionItem>();
  readonly pinned = input(false);
  readonly favorite = input(false);
  readonly showBadges = input(true);

  readonly selected = output<DashboardQuickActionItem>();
}
