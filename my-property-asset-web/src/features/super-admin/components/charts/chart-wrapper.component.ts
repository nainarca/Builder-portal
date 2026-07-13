import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { AreaChartWrapperComponent } from './area-chart-wrapper.component';
import { BarChartWrapperComponent } from './bar-chart-wrapper.component';
import { DonutChartWrapperComponent } from './donut-chart-wrapper.component';
import { LineChartWrapperComponent } from './line-chart-wrapper.component';
import { LoadingChartStateComponent } from './loading-chart-state.component';
import { PieChartWrapperComponent } from './pie-chart-wrapper.component';

@Component({
  selector: 'app-sa-chart-wrapper',
  imports: [
    LineChartWrapperComponent,
    BarChartWrapperComponent,
    PieChartWrapperComponent,
    DonutChartWrapperComponent,
    AreaChartWrapperComponent,
    LoadingChartStateComponent,
  ],
  template: `
    @if (loading()) {
      <app-sa-loading-chart-state />
    } @else {
      @switch (config().type) {
        @case ('line') {
          <app-sa-line-chart-wrapper [config]="config()" />
        }
        @case ('bar') {
          <app-sa-bar-chart-wrapper [config]="config()" />
        }
        @case ('pie') {
          <app-sa-pie-chart-wrapper [config]="config()" />
        }
        @case ('donut') {
          <app-sa-donut-chart-wrapper [config]="config()" />
        }
        @case ('area') {
          <app-sa-area-chart-wrapper [config]="config()" />
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWrapperComponent {
  readonly config = input.required<DashboardChartConfig>();
  readonly loading = input(false);
}
