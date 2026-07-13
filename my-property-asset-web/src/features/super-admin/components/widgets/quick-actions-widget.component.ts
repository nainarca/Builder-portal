import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardQuickActionItem } from '../../models/dashboard.model';
import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';
import { ActionButtonGridComponent } from '../quick-actions/action-button-grid.component';

@Component({
  selector: 'app-sa-quick-actions-widget',
  imports: [DashboardWidgetShellComponent, ActionButtonGridComponent],
  template: `
    <app-sa-dashboard-widget-shell
      title="Quick actions"
      icon="pi pi-bolt"
      description="Pinned and favorite administrative actions"
      [refreshable]="false"
    >
      <app-sa-action-button-grid
        [actions]="actions()"
        [pinnedIds]="pinnedIds()"
        [favoriteIds]="favoriteIds()"
        (actionSelected)="actionSelected.emit($event)"
      />
    </app-sa-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionsWidgetComponent {
  readonly actions = input.required<readonly DashboardQuickActionItem[]>();
  readonly pinnedIds = input<readonly string[]>([]);
  readonly favoriteIds = input<readonly string[]>([]);

  readonly actionSelected = output<DashboardQuickActionItem>();
}
