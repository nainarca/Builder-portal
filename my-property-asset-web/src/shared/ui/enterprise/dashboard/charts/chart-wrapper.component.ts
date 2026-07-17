import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import type { EnterpriseChartConfig } from '../models/enterprise-dashboard.models';
import { EnterpriseLineChartComponent } from './line-chart.component';
import { EnterpriseBarChartComponent } from './bar-chart.component';
import { EnterpriseAreaChartComponent } from './area-chart.component';
import { EnterprisePieChartComponent } from './pie-chart.component';
import { EnterpriseDonutChartComponent } from './donut-chart.component';
import { EnterpriseStackedBarChartComponent } from './stacked-bar-chart.component';
import { EnterpriseTimelineChartComponent } from './timeline-chart.component';
import { EnterpriseSparklineChartComponent } from './sparkline-chart.component';
import {
  EnterpriseChartLoadingComponent,
  EnterpriseChartDataTableComponent,
} from './chart-states.component';
import { GhostButtonComponent } from '../../buttons/enterprise-button.component';

@Component({
  selector: 'app-enterprise-chart-wrapper',
  imports: [
    EnterpriseLineChartComponent,
    EnterpriseBarChartComponent,
    EnterpriseAreaChartComponent,
    EnterprisePieChartComponent,
    EnterpriseDonutChartComponent,
    EnterpriseStackedBarChartComponent,
    EnterpriseTimelineChartComponent,
    EnterpriseSparklineChartComponent,
    EnterpriseChartLoadingComponent,
    EnterpriseChartDataTableComponent,
    GhostButtonComponent,
  ],
  template: `
    <div class="enterprise-chart-wrapper">
      @if (loading()) {
        <app-enterprise-chart-loading />
      } @else {
        @switch (config().type) {
          @case ('line') { <app-enterprise-line-chart [config]="config()" /> }
          @case ('bar') { <app-enterprise-bar-chart [config]="config()" /> }
          @case ('area') { <app-enterprise-area-chart [config]="config()" /> }
          @case ('pie') { <app-enterprise-pie-chart [config]="config()" /> }
          @case ('donut') { <app-enterprise-donut-chart [config]="config()" /> }
          @case ('stacked-bar') { <app-enterprise-stacked-bar-chart [config]="config()" /> }
          @case ('timeline') { <app-enterprise-timeline-chart [config]="config()" /> }
          @case ('sparkline') { <app-enterprise-sparkline-chart [config]="config()" /> }
        }
        @if (showDataTableToggle()) {
          <app-ghost-button
            [label]="tableVisible() ? 'Hide data table' : 'Show data table'"
            icon="pi pi-table"
            size="small"
            (clicked)="toggleTable()"
          />
          <app-enterprise-chart-data-table
            [visible]="tableVisible()"
            [seriesLabels]="seriesLabels()"
            [rows]="tableRows()"
          />
        }
      }
    </div>
  `,
  styles: `
    .enterprise-chart-wrapper { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseChartWrapperComponent {
  readonly config = input.required<EnterpriseChartConfig>();
  readonly loading = input(false);
  readonly showDataTableToggle = input(true);

  readonly tableVisible = signal(false);

  readonly seriesLabels = computed(() => this.config().series.map((series) => series.label));

  readonly tableRows = computed(() =>
    this.config().labels.map((label, index) => ({
      label,
      values: this.config().series.map((series) => series.values[index] ?? 0),
    })),
  );

  toggleTable(): void {
    this.tableVisible.update((visible) => !visible);
  }
}
