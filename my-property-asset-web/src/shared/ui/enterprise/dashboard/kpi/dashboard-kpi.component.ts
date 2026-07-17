import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MetricCardComponent } from '../../cards/enterprise-cards.component';
import { CardComponent } from '../../../composites/cards/card.component';
import { ProgressStatusComponent, HealthIndicatorComponent } from '../../status/enterprise-status.component';
import { EnterpriseSparklineChartComponent } from '../charts/sparkline-chart.component';
import type {
  EnterpriseKpiComparisonData,
  EnterpriseKpiFinancialData,
  EnterpriseKpiGrowthData,
  EnterpriseKpiOccupancyData,
  EnterpriseKpiProgressData,
  EnterpriseKpiStatusData,
} from '../models/enterprise-dashboard.models';
import type { EnterpriseMetricData, EnterpriseTrendDirection } from '../../models/enterprise.models';

@Component({
  selector: 'app-enterprise-kpi-primary',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiPrimaryComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);

  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
    hint: this.hint(),
  }));
}

@Component({
  selector: 'app-enterprise-kpi-comparison',
  imports: [CardComponent],
  template: `
    <app-card variant="flat">
      <div class="enterprise-kpi-comparison">
        <p class="enterprise-kpi-comparison__label">{{ data().label }}</p>
        <p class="enterprise-kpi-comparison__value">{{ data().value }}</p>
        @if (data().comparisonValue) {
          <p class="enterprise-kpi-comparison__compare">
            <span>{{ data().comparisonLabel ?? 'Compared to' }}</span>
            <strong>{{ data().comparisonValue }}</strong>
          </p>
        }
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-kpi-comparison { display: flex; flex-direction: column; gap: var(--mpa-spacing-xs); }
    .enterprise-kpi-comparison__label { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-kpi-comparison__value { margin: 0; font-size: var(--mpa-font-size-2xl); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-kpi-comparison__compare { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); display: flex; gap: var(--mpa-spacing-xs); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiComparisonComponent {
  readonly data = input.required<EnterpriseKpiComparisonData>();
}

@Component({
  selector: 'app-enterprise-kpi-trend',
  imports: [MetricCardComponent, EnterpriseSparklineChartComponent],
  template: `
    <div class="enterprise-kpi-trend">
      <app-metric-card [data]="metric()" />
      <app-enterprise-sparkline-chart [values]="sparklineValues()" />
    </div>
  `,
  styles: `
    .enterprise-kpi-trend { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiTrendComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly sparklineValues = input<readonly number[]>([]);

  readonly metric = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
  }));
}

@Component({
  selector: 'app-enterprise-kpi-growth',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="metric()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiGrowthComponent {
  readonly data = input.required<EnterpriseKpiGrowthData>();

  readonly metric = computed<EnterpriseMetricData>(() => ({
    label: this.data().label,
    value: this.data().value,
    trend: this.data().trend,
    trendLabel: this.data().growthRate
      ? `${this.data().growthRate}${this.data().periodLabel ? ' ' + this.data().periodLabel : ''}`
      : this.data().trendLabel,
    hint: this.data().hint,
  }));
}

@Component({
  selector: 'app-enterprise-kpi-financial',
  imports: [CardComponent],
  template: `
    <app-card variant="flat">
      <div class="enterprise-kpi-financial">
        <p class="enterprise-kpi-financial__label">{{ data().label }}</p>
        <p class="enterprise-kpi-financial__value">
          @if (data().currency) {
            <span class="enterprise-kpi-financial__currency">{{ data().currency }}</span>
          }
          {{ data().value }}
        </p>
        @if (data().trendLabel) {
          <p class="enterprise-kpi-financial__meta">{{ data().trendLabel }}</p>
        }
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-kpi-financial { display: flex; flex-direction: column; gap: var(--mpa-spacing-xs); }
    .enterprise-kpi-financial__label { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-kpi-financial__value { margin: 0; font-size: var(--mpa-font-size-2xl); font-weight: var(--mpa-font-weight-semibold); font-variant-numeric: tabular-nums; }
    .enterprise-kpi-financial__currency { font-size: var(--mpa-font-size-md); color: var(--mpa-color-text-muted); margin-right: var(--mpa-spacing-xs); }
    .enterprise-kpi-financial__meta { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiFinancialComponent {
  readonly data = input.required<EnterpriseKpiFinancialData>();
}

@Component({
  selector: 'app-enterprise-kpi-occupancy',
  imports: [CardComponent, ProgressStatusComponent],
  template: `
    <app-card variant="flat">
      <div class="enterprise-kpi-occupancy">
        <p class="enterprise-kpi-occupancy__label">{{ data().label }}</p>
        <p class="enterprise-kpi-occupancy__value">{{ data().value }}</p>
        @if (occupancyPercent() != null) {
          <app-progress-status [value]="occupancyPercent()!" [label]="occupancyLabel()" />
        }
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-kpi-occupancy { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-kpi-occupancy__label { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-kpi-occupancy__value { margin: 0; font-size: var(--mpa-font-size-xl); font-weight: var(--mpa-font-weight-semibold); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiOccupancyComponent {
  readonly data = input.required<EnterpriseKpiOccupancyData>();

  occupancyPercent(): number | null {
    const { occupied, total } = this.data();
    if (occupied == null || total == null || total === 0) return null;
    return Math.round((occupied / total) * 100);
  }

  occupancyLabel(): string {
    const { occupied, total } = this.data();
    if (occupied == null || total == null) return 'Occupancy';
    return `${occupied} of ${total} occupied`;
  }
}

@Component({
  selector: 'app-enterprise-kpi-progress',
  imports: [CardComponent, ProgressStatusComponent],
  template: `
    <app-card variant="flat">
      <app-progress-status
        [value]="data().value"
        [label]="data().label"
        [detail]="data().detail"
        [tone]="tone()"
      />
    </app-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiProgressComponent {
  readonly data = input.required<EnterpriseKpiProgressData>();

  tone(): 'default' | 'warning' | 'danger' {
    const value = this.data().value;
    if (value < 40) return 'danger';
    if (value < 70) return 'warning';
    return 'default';
  }
}

@Component({
  selector: 'app-enterprise-kpi-status',
  imports: [CardComponent, HealthIndicatorComponent],
  template: `
    <app-card variant="flat">
      <div class="enterprise-kpi-status">
        <p class="enterprise-kpi-status__label">{{ data().label }}</p>
        <app-health-indicator [level]="data().level" />
        <p class="enterprise-kpi-status__value">{{ data().statusLabel }}</p>
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-kpi-status { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-kpi-status__label { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-kpi-status__value { margin: 0; font-size: var(--mpa-font-size-md); font-weight: var(--mpa-font-weight-medium); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseKpiStatusComponent {
  readonly data = input.required<EnterpriseKpiStatusData>();
}
