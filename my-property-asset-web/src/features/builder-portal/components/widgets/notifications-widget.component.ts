import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

import { DashboardAnnouncementItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-notifications-widget',
  imports: [DashboardWidgetShellComponent, EmptyStateComponent],
  template: `
    <app-bp-dashboard-widget-shell
      title="Notifications"
      icon="pi pi-bell"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      @if (items().length === 0) {
        <app-empty-state
          title="You're all caught up"
          description="New notifications will appear here."
          icon="bell"
          [actionLabel]="undefined"
        />
      } @else {
        <div class="bp-announcement-list">
          @for (item of items(); track item.id) {
            <div class="bp-announcement" [class]="'bp-announcement--' + item.type">
              <p class="bp-announcement__title">{{ item.title }}</p>
              <p class="bp-announcement__message">{{ item.message }}</p>
              <p class="bp-announcement__date">{{ item.date }}</p>
            </div>
          }
        </div>
      }
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsWidgetComponent {
  readonly items = input.required<readonly DashboardAnnouncementItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
