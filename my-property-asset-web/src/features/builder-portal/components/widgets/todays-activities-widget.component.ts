import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardActivityItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';
import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-bp-todays-activities-widget',
  imports: [DashboardWidgetShellComponent, EmptyStateComponent],
  template: `
    <app-bp-dashboard-widget-shell
      title="Today's activities"
      icon="pi pi-calendar-plus"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      @if (items().length === 0) {
        <app-empty-state
          title="Nothing scheduled today"
          subtitle="Activities and tasks for today will appear here."
          icon="calendar-plus"
          [actionLabel]="undefined"
        />
      } @else {
        <ul class="bp-activity-list">
          @for (item of items(); track item.id) {
            <li class="bp-activity-list__item">
              <span class="bp-activity-list__icon" [class]="'bp-activity-list__icon--' + (item.tone ?? 'neutral')">
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
      }
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodaysActivitiesWidgetComponent {
  readonly items = input.required<readonly DashboardActivityItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
