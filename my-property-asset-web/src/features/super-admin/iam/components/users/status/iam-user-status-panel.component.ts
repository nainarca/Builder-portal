import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { UserAdminRecord, UserAdminStatus } from '../../../models/user-admin.model';
import { IamUserStatusBadgeComponent } from '../../shared';
import { IamUserStatusHistoryComponent } from './iam-user-status-history.component';

@Component({
  selector: 'app-iam-user-status-panel',
  imports: [DatePipe, ButtonComponent, IamUserStatusBadgeComponent, IamUserStatusHistoryComponent],
  template: `
    <section class="iam-status-panel" aria-label="User status">
      <div class="iam-status-panel__current">
        <h2 class="mpa-heading-sm">Status</h2>
        <app-iam-user-status-badge [status]="user().status" />
        <p class="iam-status-panel__updated">Updated {{ user().updatedAt | date: 'medium' }}</p>
      </div>
      <div class="iam-status-panel__actions">
        @if (user().status !== 'active') {
          <app-button label="Activate" icon="pi pi-check" [text]="true" (clicked)="statusChange.emit('active')" />
        }
        @if (user().status === 'active') {
          <app-button label="Deactivate" icon="pi pi-minus" [text]="true" (clicked)="statusChange.emit('inactive')" />
          <app-button label="Suspend" icon="pi pi-ban" [text]="true" (clicked)="statusChange.emit('suspended')" />
        }
        @if (user().status !== 'archived') {
          <app-button label="Archive" icon="pi pi-archive" [text]="true" severity="danger" (clicked)="statusChange.emit('archived')" />
        } @else {
          <app-button label="Restore" icon="pi pi-refresh" [text]="true" (clicked)="statusChange.emit('active')" />
        }
      </div>
      <app-iam-user-status-history [items]="history()" />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserStatusPanelComponent {
  readonly user = input.required<UserAdminRecord>();
  readonly history = input.required<readonly import('../../../models/user-admin.model').UserStatusHistoryRecord[]>();
  readonly statusChange = output<UserAdminStatus>();
}
