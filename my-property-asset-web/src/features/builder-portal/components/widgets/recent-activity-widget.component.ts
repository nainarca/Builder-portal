import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardActivityItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-recent-activity-widget',
  imports: [DashboardWidgetShellComponent],
  template: `
    <app-bp-dashboard-widget-shell
      title="Recent activity"
      icon="pi pi-history"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <ul class="bp-activity-list">
        @for (item of items(); track item.id) {
          <li class="bp-activity-list__item">
            <span class="bp-activity-list__icon" [class]="activityIconClass(item)">
              <i [class]="item.icon" aria-hidden="true"></i>
            </span>
            <div>
              <p class="bp-activity-list__title">{{ item.title }}</p>
              <p class="bp-activity-list__description">{{ item.description }}</p>
              <p class="bp-activity-list__time">{{ item.timestamp }}</p>
            </div>
          </li>
        }
      </ul>
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityWidgetComponent {
  readonly items = input.required<readonly DashboardActivityItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();

  activityIconClass(item: DashboardActivityItem): string {
    return `bp-activity-list__icon--${item.tone ?? 'neutral'}`;
  }
}
