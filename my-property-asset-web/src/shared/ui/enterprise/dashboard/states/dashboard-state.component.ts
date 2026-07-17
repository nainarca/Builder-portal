import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SkeletonDashboardComponent } from '../../loading/enterprise-loading.component';
import {
  EmptyComingSoonComponent,
  EmptyNoDataComponent,
  EmptyPermissionDeniedComponent,
} from '../../empty-states/enterprise-empty-states.component';
import { ErrorAlertComponent } from '../../alerts/enterprise-alerts.component';
import type { EnterpriseDashboardLifecycleState } from '../models/enterprise-dashboard.models';

@Component({
  selector: 'app-enterprise-dashboard-state',
  imports: [
    SkeletonDashboardComponent,
    EmptyNoDataComponent,
    EmptyPermissionDeniedComponent,
    EmptyComingSoonComponent,
    ErrorAlertComponent,
  ],
  template: `
    <div
      class="enterprise-dashboard-state"
      [attr.aria-busy]="state() === 'loading' || state() === 'refreshing' ? 'true' : null"
    >
      @switch (state()) {
        @case ('loading') {
          <app-skeleton-dashboard />
        }
        @case ('no-data') {
          <app-empty-no-data
            [title]="emptyTitle() ?? 'No data'"
            [description]="emptyDescription()"
            [actionLabel]="emptyActionLabel()"
            (action)="emptyAction.emit($event)"
          />
        }
        @case ('permission-denied') {
          <app-empty-permission-denied
            [title]="permissionTitle() ?? 'Permission denied'"
            [description]="permissionDescription()"
            (action)="emptyAction.emit($event)"
          />
        }
        @case ('error') {
          <app-error-alert [message]="errorMessage() ?? 'Unable to load dashboard'" />
        }
        @case ('maintenance') {
          <app-empty-coming-soon
            [title]="maintenanceTitle()"
            [description]="maintenanceMessage() ?? 'Dashboard is temporarily unavailable for maintenance.'"
          />
        }
        @default {
          <ng-content />
        }
      }
    </div>
  `,
  styles: `
    .enterprise-dashboard-state { width: 100%; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardStateComponent {
  readonly state = input<EnterpriseDashboardLifecycleState>('idle');
  readonly errorMessage = input<string | undefined>(undefined);
  readonly maintenanceMessage = input<string | undefined>(undefined);
  readonly emptyTitle = input<string | undefined>(undefined);
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly emptyActionLabel = input<string | undefined>(undefined);
  readonly permissionTitle = input<string | undefined>(undefined);
  readonly permissionDescription = input<string | undefined>(undefined);
  readonly maintenanceTitle = input('Maintenance mode');

  readonly emptyAction = output<MouseEvent>();
}
