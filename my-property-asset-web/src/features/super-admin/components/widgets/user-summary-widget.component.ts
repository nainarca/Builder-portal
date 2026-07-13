import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardSummaryItem } from '../../models/dashboard.model';
import { SummaryCardComponent } from '../cards/summary-card.component';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-sa-user-summary-widget',
  imports: [DashboardWidgetShellComponent, SummaryCardComponent],
  template: `
    <app-sa-dashboard-widget-shell
      title="User summary"
      icon="pi pi-users"
      description="Placeholder — ADMIN-002"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      @if (item(); as summary) {
        <app-sa-summary-card [item]="summary" />
      }
    </app-sa-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSummaryWidgetComponent {
  readonly item = input.required<DashboardSummaryItem>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
