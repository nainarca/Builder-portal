import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { ChartWrapperComponent } from '../charts/chart-wrapper.component';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-project-status-overview-widget',
  imports: [DashboardWidgetShellComponent, ChartWrapperComponent],
  template: `
    <app-bp-dashboard-widget-shell
      [title]="chart().title"
      icon="pi pi-chart-pie"
      [description]="chart().subtitle"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <app-bp-chart-wrapper [config]="chart()" [loading]="loading()" />
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusOverviewWidgetComponent {
  readonly chart = input.required<DashboardChartConfig>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
