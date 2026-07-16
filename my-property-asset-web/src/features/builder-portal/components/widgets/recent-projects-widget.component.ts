import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardProjectSummaryItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-recent-projects-widget',
  imports: [DashboardWidgetShellComponent],
  template: `
    <app-bp-dashboard-widget-shell
      title="Recent projects"
      icon="pi pi-briefcase"
      description="Latest activity across your portfolio"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <ul class="bp-project-list">
        @for (project of items(); track project.id) {
          <li class="bp-project-list__item">
            <div class="bp-project-list__main">
              <p class="bp-project-list__name">{{ project.name }}</p>
              <p class="bp-project-list__location">{{ project.location }}</p>
            </div>
            <div class="bp-project-list__meta">
              <span class="bp-project-list__status" [class]="statusClass(project.status)">{{
                statusLabel(project.status)
              }}</span>
              <span class="bp-project-list__units">{{ project.unitsSold }}/{{ project.unitsTotal }} sold</span>
            </div>
          </li>
        }
      </ul>
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentProjectsWidgetComponent {
  readonly items = input.required<readonly DashboardProjectSummaryItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();

  statusClass(status: DashboardProjectSummaryItem['status']): string {
    return `bp-project-list__status--${status}`;
  }

  statusLabel(status: DashboardProjectSummaryItem['status']): string {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'planning':
        return 'Planning';
      case 'construction':
        return 'Construction';
      case 'completed':
        return 'Completed';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  }
}
