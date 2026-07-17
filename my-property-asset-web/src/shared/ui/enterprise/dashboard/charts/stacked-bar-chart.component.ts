import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { EnterpriseChartConfig } from '../models/enterprise-dashboard.models';
import { chartColor, hasChartData } from './utils/chart.utils';
import {
  EnterpriseChartLegendComponent,
  EnterpriseChartToolbarComponent,
} from './chart-toolbar.component';
import { EnterpriseChartEmptyComponent } from './chart-states.component';

@Component({
  selector: 'app-enterprise-stacked-bar-chart',
  imports: [EnterpriseChartToolbarComponent, EnterpriseChartLegendComponent, EnterpriseChartEmptyComponent],
  template: `
    <div class="enterprise-chart" role="img" [attr.aria-label]="config().title">
      <app-enterprise-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-enterprise-chart-empty [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="enterprise-chart__canvas">
          <svg class="enterprise-chart__svg" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
            @for (labelIndex of labelIndices(); track labelIndex) {
              @for (series of config().series; track series.label; let seriesIndex = $index) {
                <rect
                  [attr.x]="groupX(labelIndex)"
                  [attr.y]="segmentY(labelIndex, seriesIndex)"
                  [attr.width]="segmentWidth()"
                  [attr.height]="segmentHeight(labelIndex, seriesIndex)"
                  [attr.fill]="chartColor(seriesIndex, series.color)"
                  rx="2"
                />
              }
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
export class EnterpriseStackedBarChartComponent {
  readonly config = input.required<EnterpriseChartConfig>();
  readonly hasData = computed(() => hasChartData(this.config()));
  readonly legendItems = computed(() =>
    this.config().series.map((series, index) => ({
      label: series.label,
      color: chartColor(index, series.color),
    })),
  );
  readonly chartColor = chartColor;

  labelIndices(): number[] {
    return this.config().labels.map((_, index) => index);
  }

  totals(): number[] {
    return this.config().labels.map((_, labelIndex) =>
      this.config().series.reduce((sum, series) => sum + (series.values[labelIndex] ?? 0), 0),
    );
  }

  segmentWidth(): number {
    const count = this.config().labels.length || 1;
    return (320 - 16) / count - 8;
  }

  groupX(labelIndex: number): number {
    const count = this.config().labels.length || 1;
    const slot = (320 - 16) / count;
    return 8 + labelIndex * slot + 4;
  }

  segmentHeight(labelIndex: number, seriesIndex: number): number {
    const total = this.totals()[labelIndex] || 1;
    const value = this.config().series[seriesIndex]?.values[labelIndex] ?? 0;
    return (value / total) * 128;
  }

  segmentY(labelIndex: number, seriesIndex: number): number {
    const total = this.totals()[labelIndex] || 1;
    let offset = 0;
    for (let i = 0; i < seriesIndex; i++) {
      offset += this.config().series[i]?.values[labelIndex] ?? 0;
    }
    const current = this.config().series[seriesIndex]?.values[labelIndex] ?? 0;
    const base = 152 - ((offset + current) / total) * 128;
    return base;
  }
}

@Component({
  selector: 'app-enterprise-timeline-chart',
  imports: [EnterpriseChartToolbarComponent, EnterpriseChartEmptyComponent],
  template: `
    <div class="enterprise-chart enterprise-timeline-chart" role="img" [attr.aria-label]="config().title">
      <app-enterprise-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-enterprise-chart-empty [message]="config().emptyMessage ?? 'No timeline data'" />
      } @else {
        <ol class="enterprise-timeline-chart__list">
          @for (label of config().labels; track label; let i = $index) {
            <li class="enterprise-timeline-chart__item">
              <span class="enterprise-timeline-chart__node" aria-hidden="true"></span>
              <div>
                <p class="enterprise-timeline-chart__label">{{ label }}</p>
                <p class="enterprise-timeline-chart__value">{{ primaryValue(i) }}</p>
              </div>
            </li>
          }
        </ol>
      }
    </div>
  `,
  styles: `
    .enterprise-timeline-chart__list {
      list-style: none; margin: 0; padding: 0;
      display: flex; flex-direction: column; gap: var(--mpa-spacing-md);
    }
    .enterprise-timeline-chart__item {
      display: flex; gap: var(--mpa-spacing-sm); align-items: flex-start;
    }
    .enterprise-timeline-chart__node {
      width: 0.65rem; height: 0.65rem; margin-top: 0.35rem;
      border-radius: var(--mpa-radius-full); background: var(--mpa-color-primary); flex-shrink: 0;
    }
    .enterprise-timeline-chart__label { margin: 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
    .enterprise-timeline-chart__value { margin: 0.15rem 0 0; font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTimelineChartComponent {
  readonly config = input.required<EnterpriseChartConfig>();
  readonly hasData = computed(() => hasChartData(this.config()));

  primaryValue(index: number): string {
    const value = this.config().series[0]?.values[index];
    return value != null ? String(value) : '—';
  }
}
