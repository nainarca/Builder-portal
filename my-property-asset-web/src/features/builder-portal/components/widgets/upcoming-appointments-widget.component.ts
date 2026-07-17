import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

import { DashboardActivityItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-upcoming-appointments-widget',
  imports: [DashboardWidgetShellComponent, EmptyStateComponent],
  template: `
    <app-bp-dashboard-widget-shell
      title="Upcoming appointments"
      icon="pi pi-map-marker"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      @if (items().length === 0) {
        <app-empty-state
          title="No appointments scheduled"
          subtitle="Site visits and handover walkthroughs will appear here."
          icon="map-marker"
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
export class UpcomingAppointmentsWidgetComponent {
  readonly items = input.required<readonly DashboardActivityItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
