import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { ChartLegendComponent } from './chart-legend.component';
import { ChartToolbarComponent } from './chart-toolbar.component';
import { chartColor, donutGradient, hasChartData } from './chart.utils';
import { EmptyChartStateComponent } from './empty-chart-state.component';

@Component({
  selector: 'app-bp-donut-chart-wrapper',
  imports: [ChartToolbarComponent, ChartLegendComponent, EmptyChartStateComponent],
  template: `
    <div class="bp-chart">
      <app-bp-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-bp-empty-chart-state [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="bp-donut-chart">
          <div class="bp-donut-chart__ring" [style.background]="gradient()"></div>
          <app-bp-chart-legend [items]="legendItems()" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartWrapperComponent {
  readonly config = input.required<DashboardChartConfig>();

  readonly hasData = computed(() => hasChartData(this.config()));
  readonly gradient = computed(() => donutGradient(this.config()));
  readonly legendItems = computed(() =>
    (this.config().labels ?? []).map((label, index) => ({
      label,
      color: chartColor(index),
    })),
  );
}
