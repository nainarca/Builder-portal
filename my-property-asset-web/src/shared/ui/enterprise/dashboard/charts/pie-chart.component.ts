import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { EnterpriseChartConfig } from '../models/enterprise-dashboard.models';
import { chartColor, donutGradient, hasChartData } from './utils/chart.utils';
import {
  EnterpriseChartLegendComponent,
  EnterpriseChartToolbarComponent,
} from './chart-toolbar.component';
import { EnterpriseChartEmptyComponent } from './chart-states.component';

@Component({
  selector: 'app-enterprise-donut-chart',
  imports: [EnterpriseChartToolbarComponent, EnterpriseChartLegendComponent, EnterpriseChartEmptyComponent],
  template: `
    <div class="enterprise-chart enterprise-donut-chart" role="img" [attr.aria-label]="config().title">
      <app-enterprise-chart-toolbar [title]="config().title" [subtitle]="config().subtitle" />
      @if (!hasData()) {
        <app-enterprise-chart-empty [message]="config().emptyMessage ?? 'No data available'" />
      } @else {
        <div class="enterprise-donut-chart__body">
          <div class="enterprise-donut-chart__ring" [style.background]="gradient()"></div>
          <app-enterprise-chart-legend [items]="legendItems()" />
        </div>
      }
    </div>
  `,
  styleUrl: '../styles/enterprise-dashboard-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDonutChartComponent {
  readonly config = input.required<EnterpriseChartConfig>();
  readonly hasData = computed(() => hasChartData(this.config()));
  readonly gradient = computed(() => donutGradient(this.config()));
  readonly legendItems = computed(() =>
    (this.config().labels ?? []).map((label, index) => ({
      label,
      color: chartColor(index),
    })),
  );
}

@Component({
  selector: 'app-enterprise-pie-chart',
  imports: [EnterpriseDonutChartComponent],
  template: `<app-enterprise-donut-chart [config]="config()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterprisePieChartComponent {
  readonly config = input.required<EnterpriseChartConfig>();
}
