import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { ChartWrapperComponent } from '../charts/chart-wrapper.component';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-sa-organizations-chart-widget',
  imports: [DashboardWidgetShellComponent, ChartWrapperComponent],
  template: `
    <app-sa-dashboard-widget-shell
      [title]="chart().title"
      icon="pi pi-chart-bar"
      [description]="chart().subtitle"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <app-sa-chart-wrapper [config]="chart()" [loading]="loading()" />
    </app-sa-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsChartWidgetComponent {
  readonly chart = input.required<DashboardChartConfig>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
