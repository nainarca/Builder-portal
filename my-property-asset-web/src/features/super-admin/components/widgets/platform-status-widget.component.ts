import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardStatusItem } from '../../models/dashboard.model';
import { StatusCardComponent } from '../cards/status-card.component';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-sa-platform-status-widget',
  imports: [DashboardWidgetShellComponent, StatusCardComponent],
  template: `
    <app-sa-dashboard-widget-shell
      title="Platform status"
      icon="pi pi-server"
      description="Core service availability"
      [refreshable]="true"
      [loading]="loading()"
      (refresh)="refresh.emit()"
    >
      <div class="sa-metric-list">
        @for (item of items(); track item.id) {
          <app-sa-status-card [item]="item" />
        }
      </div>
    </app-sa-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformStatusWidgetComponent {
  readonly items = input.required<readonly DashboardStatusItem[]>();
  readonly loading = input(false);

  readonly refresh = output<void>();
}
