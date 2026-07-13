import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { DonutChartWrapperComponent } from './donut-chart-wrapper.component';

@Component({
  selector: 'app-sa-pie-chart-wrapper',
  imports: [DonutChartWrapperComponent],
  template: `<app-sa-donut-chart-wrapper [config]="config()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartWrapperComponent {
  readonly config = input.required<DashboardChartConfig>();
}
