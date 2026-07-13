import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardAnnouncementItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-sa-announcements-widget',
  imports: [DashboardWidgetShellComponent],
  template: `
    <app-sa-dashboard-widget-shell
      title="Announcements"
      icon="pi pi-megaphone"
      [refreshable]="false"
    >
      <div class="sa-announcement-list">
        @for (item of items(); track item.id) {
          <article class="sa-announcement" [class]="announcementClass(item)">
            <h3 class="sa-announcement__title">{{ item.title }}</h3>
            <p class="sa-announcement__message">{{ item.message }}</p>
            <p class="sa-announcement__date">{{ item.date }}</p>
          </article>
        }
      </div>
    </app-sa-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementsWidgetComponent {
  readonly items = input.required<readonly DashboardAnnouncementItem[]>();

  announcementClass(item: DashboardAnnouncementItem): string {
    return `sa-announcement--${item.type}`;
  }
}
