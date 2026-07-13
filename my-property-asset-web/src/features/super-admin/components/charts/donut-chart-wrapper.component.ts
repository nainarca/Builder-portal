import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { chartColor, donutGradient, hasChartData } from './chart.utils';
import { ChartLegendComponent } from './chart-legend.component';
import { ChartToolbarComponent } from './chart-toolbar.component';
import { EmptyChartStateComponent } from './empty-chart-state.component';

@Component({
  selector: 'app-sa-donut-chart-wrapper',
  imports: [ChartToolbarComponent, ChartLegendComponent, EmptyChartStateComponent],
  template: `
    <div class="sa-chart">
      <app-sa-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-sa-empty-chart-state [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="sa-donut-chart">
          <div class="sa-donut-chart__ring" [style.background]="gradient()"></div>
          <app-sa-chart-legend [items]="legendItems()" />
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
