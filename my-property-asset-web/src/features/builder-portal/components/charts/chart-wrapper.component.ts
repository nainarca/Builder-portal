import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { BarChartWrapperComponent } from './bar-chart-wrapper.component';
import { DonutChartWrapperComponent } from './donut-chart-wrapper.component';
import { LoadingChartStateComponent } from './loading-chart-state.component';

@Component({
  selector: 'app-bp-chart-wrapper',
  imports: [BarChartWrapperComponent, DonutChartWrapperComponent, LoadingChartStateComponent],
  template: `
    @if (loading()) {
      <app-bp-loading-chart-state />
    } @else {
      @switch (config().type) {
        @case ('bar') {
          <app-bp-bar-chart-wrapper [config]="config()" />
        }
        @case ('donut') {
          <app-bp-donut-chart-wrapper [config]="config()" />
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
