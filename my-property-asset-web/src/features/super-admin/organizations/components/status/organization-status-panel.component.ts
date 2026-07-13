import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { OrganizationAdminRecord, OrganizationStatusHistoryRecord } from '../../models/organization-admin.model';
import { OrganizationStatusBadgeComponent } from '../shared/organization-status-badge.component';
import { OrganizationStatusHistoryComponent } from './organization-status-history.component';

@Component({
  selector: 'app-org-status-panel',
  imports: [
    DatePipe,
    ButtonComponent,
    OrganizationStatusBadgeComponent,
    OrganizationStatusHistoryComponent,
  ],
  template: `
    <section class="org-status-panel" aria-label="Organization status">
      <div class="org-status-panel__current">
        <h3 class="mpa-heading-sm">Current status</h3>
        <app-org-status-badge [status]="org().status" />
        <p class="org-status-panel__updated">Last updated {{ org().updatedAt | date: 'medium' }}</p>
      </div>

      <div class="org-status-panel__actions">
        @if (org().status !== 'active') {
          <app-button label="Activate" icon="pi pi-check" size="small" (clicked)="statusChange.emit('active')" />
        }
        @if (org().status !== 'inactive' && org().status !== 'archived') {
          <app-button label="Deactivate" icon="pi pi-pause" size="small" [outlined]="true" (clicked)="statusChange.emit('inactive')" />
        }
        @if (org().status !== 'archived') {
          <app-button label="Archive" icon="pi pi-archive" size="small" severity="danger" [outlined]="true" (clicked)="statusChange.emit('archived')" />
        }
        @if (org().status === 'archived') {
          <app-button label="Restore" icon="pi pi-replay" size="small" (clicked)="statusChange.emit('active')" />
        }
      </div>

      <app-org-status-history [items]="history()" />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationStatusPanelComponent {
  readonly org = input.required<OrganizationAdminRecord>();
  readonly history = input.required<readonly OrganizationStatusHistoryRecord[]>();

  readonly statusChange = output<OrganizationAdminRecord['status']>();
}
