import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { ChartWrapperComponent } from '../charts/chart-wrapper.component';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-sa-usage-overview-widget',
  imports: [DashboardWidgetShellComponent, ChartWrapperComponent],
  template: `
    <app-sa-dashboard-widget-shell
      title="Usage metrics"
      icon="pi pi-chart-pie"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <app-sa-chart-wrapper [config]="chart()" [loading]="loading()" />
    </app-sa-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsageOverviewWidgetComponent {
  readonly chart = input.required<DashboardChartConfig>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
