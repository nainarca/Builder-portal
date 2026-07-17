import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import {
  DangerButtonComponent,
  EnterpriseSectionHeaderComponent,
  OutlineButtonComponent,
  PrimaryButtonComponent,
} from '@shared/ui';

import { OrganizationAdminRecord, OrganizationStatusHistoryRecord } from '../../models/organization-admin.model';
import { OrganizationStatusBadgeComponent } from '../shared/organization-status-badge.component';
import { OrganizationStatusHistoryComponent } from './organization-status-history.component';

@Component({
  selector: 'app-org-status-panel',
  imports: [
    DatePipe,
    EnterpriseSectionHeaderComponent,
    PrimaryButtonComponent,
    OutlineButtonComponent,
    DangerButtonComponent,
    OrganizationStatusBadgeComponent,
    OrganizationStatusHistoryComponent,
  ],
  template: `
    <section class="org-status-panel" aria-label="Organization status">
      <app-enterprise-section-header
        title="Lifecycle status"
        description="Activate, deactivate, archive, or restore this organization"
      />

      <div class="org-status-panel__current">
        <app-org-status-badge [status]="org().status" />
        <p class="org-status-panel__updated">Last updated {{ org().updatedAt | date: 'medium' }}</p>
      </div>

      <div class="org-status-panel__actions" role="toolbar" aria-label="Status actions">
        @if (org().status !== 'active') {
          <app-primary-button label="Activate" icon="pi pi-check" size="small" (clicked)="statusChange.emit('active')" />
        }
        @if (org().status !== 'inactive' && org().status !== 'archived') {
          <app-outline-button label="Deactivate" icon="pi pi-pause" size="small" (clicked)="statusChange.emit('inactive')" />
        }
        @if (org().status !== 'archived') {
          <app-danger-button label="Archive" icon="pi pi-archive" size="small" (clicked)="statusChange.emit('archived')" />
        }
        @if (org().status === 'archived') {
          <app-primary-button label="Restore" icon="pi pi-replay" size="small" (clicked)="statusChange.emit('active')" />
        }
      </div>

      <app-org-status-history [items]="history()" />
    </section>
  `,
  styles: `
    .org-status-panel {
      display: grid;
      gap: var(--mpa-spacing-lg);
      padding: var(--mpa-spacing-lg);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-xl);
      background: var(--mpa-color-surface-elevated);
    }

    .org-status-panel__current {
      display: grid;
      gap: var(--mpa-spacing-sm);
    }

    .org-status-panel__updated {
      margin: 0;
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }

    .org-status-panel__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs);
      padding-bottom: var(--mpa-spacing-lg);
      border-bottom: 1px solid var(--mpa-color-border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationStatusPanelComponent {
  readonly org = input.required<OrganizationAdminRecord>();
  readonly history = input.required<readonly OrganizationStatusHistoryRecord[]>();

  readonly statusChange = output<OrganizationAdminRecord['status']>();
}
