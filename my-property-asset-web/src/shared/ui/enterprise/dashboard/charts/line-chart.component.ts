import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { EnterpriseChartConfig } from '../models/enterprise-dashboard.models';
import { buildAreaPath, buildLinePath, chartColor, hasChartData } from './utils/chart.utils';
import {
  EnterpriseChartLegendComponent,
  EnterpriseChartToolbarComponent,
} from './chart-toolbar.component';
import { EnterpriseChartEmptyComponent } from './chart-states.component';

@Component({
  selector: 'app-enterprise-line-chart',
  imports: [EnterpriseChartToolbarComponent, EnterpriseChartLegendComponent, EnterpriseChartEmptyComponent],
  template: `
    <div class="enterprise-chart" role="img" [attr.aria-label]="config().title">
      <app-enterprise-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-enterprise-chart-empty [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="enterprise-chart__canvas">
          <svg class="enterprise-chart__svg" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
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
        <app-enterprise-chart-legend [items]="legendItems()" />
      }
    </div>
  `,
  styleUrl: '../styles/enterprise-dashboard-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseLineChartComponent {
  readonly config = input.required<EnterpriseChartConfig>();
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

@Component({
  selector: 'app-enterprise-bar-chart',
  imports: [EnterpriseChartToolbarComponent, EnterpriseChartLegendComponent, EnterpriseChartEmptyComponent],
  template: `
    <div class="enterprise-chart" role="img" [attr.aria-label]="config().title">
      <app-enterprise-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-enterprise-chart-empty [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="enterprise-chart__canvas">
          <svg class="enterprise-chart__svg" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
            @for (value of primarySeries(); track $index) {
              <rect
                [attr.x]="barX($index)"
                [attr.y]="barY($index)"
                [attr.width]="barWidth()"
                [attr.height]="barHeight($index)"
                [attr.fill]="chartColor(0, config().series[0]?.color)"
                rx="3"
              />
            }
          </svg>
        </div>
        <app-enterprise-chart-legend [items]="legendItems()" />
      }
    </div>
  `,
  styleUrl: '../styles/enterprise-dashboard-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseBarChartComponent {
  readonly config = input.required<EnterpriseChartConfig>();
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
  barY(index: number): number {
    const ratio = this.normalized()[index] ?? 0;
    return 152 - ratio * 128;
  }
  barHeight(index: number): number {
    const ratio = this.normalized()[index] ?? 0;
    return ratio * 128 + 4;
  }
  private normalized(): readonly number[] {
    const values = this.primarySeries();
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values.map((value) => (value - min) / range);
  }
}

@Component({
  selector: 'app-enterprise-area-chart',
  imports: [EnterpriseChartToolbarComponent, EnterpriseChartLegendComponent, EnterpriseChartEmptyComponent],
  template: `
    <div class="enterprise-chart" role="img" [attr.aria-label]="config().title">
      <app-enterprise-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-enterprise-chart-empty [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="enterprise-chart__canvas">
          <svg class="enterprise-chart__svg" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
            @for (series of config().series; track series.label; let i = $index) {
              <path
                [attr.d]="areaPath(series.values)"
                [attr.fill]="chartColor(i, series.color)"
                fill-opacity="0.18"
                [attr.stroke]="chartColor(i, series.color)"
                stroke-width="2"
              />
            }
          </svg>
        </div>
        <app-enterprise-chart-legend [items]="legendItems()" />
      }
    </div>
  `,
  styleUrl: '../styles/enterprise-dashboard-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseAreaChartComponent {
  readonly config = input.required<EnterpriseChartConfig>();
  readonly hasData = computed(() => hasChartData(this.config()));
  readonly legendItems = computed(() =>
    this.config().series.map((series, index) => ({
      label: series.label,
      color: chartColor(index, series.color),
    })),
  );
  readonly chartColor = chartColor;
  areaPath(values: readonly number[]): string {
    return buildAreaPath(values, 320, 160);
  }
}
