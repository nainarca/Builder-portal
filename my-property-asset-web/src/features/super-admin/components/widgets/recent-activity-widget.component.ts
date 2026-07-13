import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardActivityItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-sa-recent-activity-widget',
  imports: [DashboardWidgetShellComponent],
  template: `
    <app-sa-dashboard-widget-shell
      title="Recent activity"
      icon="pi pi-history"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <ul class="sa-activity-list">
        @for (item of items(); track item.id) {
          <li class="sa-activity-list__item">
            <span class="sa-activity-list__icon" [class]="activityIconClass(item)">
              <i [class]="item.icon" aria-hidden="true"></i>
            </span>
            <div>
              <p class="sa-activity-list__title">{{ item.title }}</p>
              <p class="sa-activity-list__description">{{ item.description }}</p>
              <p class="sa-activity-list__time">{{ item.timestamp }}</p>
            </div>
          </li>
        }
      </ul>
    </app-sa-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityWidgetComponent {
  readonly items = input.required<readonly DashboardActivityItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();

  activityIconClass(item: DashboardActivityItem): string {
    return `sa-activity-list__icon--${item.tone ?? 'neutral'}`;
  }
}
