import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

import { DashboardWidgetShellComponent } from '../dashboard/dashboard-widget-shell.component';

@Component({
  selector: 'app-bp-calendar-widget',
  imports: [DashboardWidgetShellComponent, EmptyStateComponent],
  template: `
    <app-bp-dashboard-widget-shell title="Calendar" icon="pi pi-calendar" [refreshable]="false">
      <app-empty-state
        title="Calendar view coming soon"
        description="A full builder calendar will appear here in a future module."
        icon="calendar"
        [actionLabel]="undefined"
      />
    </app-bp-dashboard-widget-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWidgetComponent {}
