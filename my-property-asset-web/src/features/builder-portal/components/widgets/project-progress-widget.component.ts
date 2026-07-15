import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardProjectSummaryItem } from '../../models/dashboard.model';
import { ProgressCardComponent } from '../cards/progress-card.component';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-project-progress-widget',
  imports: [DashboardWidgetShellComponent, ProgressCardComponent],
  template: `
    <app-bp-dashboard-widget-shell
      title="Project progress"
      icon="pi pi-gauge"
      description="Completion tracking for active sites"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <div class="bp-progress-card-list">
        @for (project of items(); track project.id) {
          <app-bp-progress-card [item]="project" />
        }
      </div>
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectProgressWidgetComponent {
  readonly items = input.required<readonly DashboardProjectSummaryItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
