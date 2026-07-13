import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { buildLinePath, chartColor, hasChartData } from './chart.utils';
import { ChartLegendComponent } from './chart-legend.component';
import { ChartToolbarComponent } from './chart-toolbar.component';
import { EmptyChartStateComponent } from './empty-chart-state.component';

@Component({
  selector: 'app-sa-line-chart-wrapper',
  imports: [ChartToolbarComponent, ChartLegendComponent, EmptyChartStateComponent],
  template: `
    <div class="sa-chart">
      <app-sa-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-sa-empty-chart-state [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="sa-chart__canvas">
          <svg class="sa-chart__svg" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
            @for (series of config().series; track series.label; let i = $index) {
              <path
                [attr.d]="linePath(series.values)"
                fill="none"
                [attr.stroke]="chartColor(i, series.color)"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            }
          </svg>
        </div>
        <app-sa-chart-legend [items]="legendItems()" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartWrapperComponent {
  readonly config = input.required<DashboardChartConfig>();

  readonly hasData = computed(() => hasChartData(this.config()));
  readonly legendItems = computed(() =>
    this.config().series.map((series, index) => ({
      label: series.label,
      color: chartColor(index, series.color),
    })),
  );

  readonly chartColor = chartColor;

  linePath(values: readonly number[]): string {
    return buildLinePath(values, 320, 160);
  }
}
