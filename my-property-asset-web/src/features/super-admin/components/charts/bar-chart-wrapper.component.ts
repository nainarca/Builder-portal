import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardChartConfig } from '../../models/dashboard.model';
import { chartColor, hasChartData, normalizeValues } from './chart.utils';
import { ChartLegendComponent } from './chart-legend.component';
import { ChartToolbarComponent } from './chart-toolbar.component';
import { EmptyChartStateComponent } from './empty-chart-state.component';

@Component({
  selector: 'app-sa-bar-chart-wrapper',
  imports: [ChartToolbarComponent, ChartLegendComponent, EmptyChartStateComponent],
  template: `
    <div class="sa-chart">
      <app-sa-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-sa-empty-chart-state [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="sa-chart__canvas">
          <svg class="sa-chart__svg" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
            @for (value of primarySeries(); track $index) {
              <rect
                [attr.x]="barX($index)"
                [attr.y]="barY(value)"
                [attr.width]="barWidth()"
                [attr.height]="barHeight(value)"
                [attr.fill]="chartColor(0, config().series[0]?.color)"
                rx="3"
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
export class BarChartWrapperComponent {
  readonly config = input.required<DashboardChartConfig>();

  readonly hasData = computed(() => hasChartData(this.config()));
  readonly primarySeries = computed(() => this.config().series[0]?.values ?? []);
  readonly legendItems = computed(() =>
    this.config().series.map((series, index) => ({
      label: series.label,
      color: chartColor(index, series.color),
    })),
  );

  readonly chartColor = chartColor;

  barWidth(): number {
    const count = this.primarySeries().length || 1;
    return (320 - 16) / count - 8;
  }

  barX(index: number): number {
    const count = this.primarySeries().length || 1;
    const slot = (320 - 16) / count;
    return 8 + index * slot + 4;
  }

  barY(value: number): number {
    const { normalized } = normalizeValues(this.primarySeries());
    const index = this.primarySeries().indexOf(value);
    const ratio = normalized[index] ?? 0;
    return 152 - ratio * 128;
  }

  barHeight(value: number): number {
    const { normalized } = normalizeValues(this.primarySeries());
    const index = this.primarySeries().indexOf(value);
    const ratio = normalized[index] ?? 0;
    return ratio * 128 + 4;
  }
}
