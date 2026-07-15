import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardTrendItem } from '../../models/dashboard.model';
import { TrendCardComponent } from '../cards/trend-card.component';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-performance-summary-widget',
  imports: [DashboardWidgetShellComponent, TrendCardComponent],
  template: `
    <app-bp-dashboard-widget-shell
      title="Performance summary"
      icon="pi pi-chart-line"
      description="Sales and delivery velocity"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <div class="bp-performance-summary">
        @for (trend of items(); track trend.id) {
          <app-bp-trend-card [item]="trend" />
        }
      </div>
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceSummaryWidgetComponent {
  readonly items = input.required<readonly DashboardTrendItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
