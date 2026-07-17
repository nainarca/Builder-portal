import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { MetricCardComponent } from '../cards/enterprise-cards.component';
import { EnterpriseMetricData, EnterpriseTrendDirection } from '../models/enterprise.models';

@Component({
  selector: 'app-kpi-revenue',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiRevenueComponent {
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly label = input('Revenue');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
  }));
}

@Component({
  selector: 'app-kpi-projects',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiProjectsComponent {
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly label = input('Projects');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
  }));
}

@Component({
  selector: 'app-kpi-units',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiUnitsComponent {
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly label = input('Units');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
  }));
}

@Component({
  selector: 'app-kpi-owners',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiOwnersComponent {
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly label = input('Owners');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
  }));
}

@Component({
  selector: 'app-kpi-revenue-trend',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiRevenueTrendComponent {
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection>('up');
  readonly trendLabel = input<string | undefined>(undefined);
  readonly label = input('Revenue Trend');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
  }));
}

@Component({
  selector: 'app-kpi-completion',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCompletionComponent {
  readonly value = input.required<string>();
  readonly trend = input<EnterpriseTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly label = input('Completion %');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    trend: this.trend(),
    trendLabel: this.trendLabel(),
  }));
}

@Component({
  selector: 'app-kpi-pending',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiPendingComponent {
  readonly value = input.required<string>();
  readonly hint = input<string | undefined>(undefined);
  readonly label = input('Pending');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    hint: this.hint(),
  }));
}

@Component({
  selector: 'app-kpi-alerts',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiAlertsComponent {
  readonly value = input.required<string>();
  readonly hint = input<string | undefined>(undefined);
  readonly label = input('Alerts');
  readonly data = computed<EnterpriseMetricData>(() => ({
    label: this.label(),
    value: this.value(),
    hint: this.hint(),
  }));
}

@Component({
  selector: 'app-kpi-widget',
  imports: [MetricCardComponent],
  template: `<app-metric-card [data]="data()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'selected.emit()',
  },
})
export class KpiWidgetComponent {
  readonly data = input.required<EnterpriseMetricData>();
  readonly selected = output<void>();
}
