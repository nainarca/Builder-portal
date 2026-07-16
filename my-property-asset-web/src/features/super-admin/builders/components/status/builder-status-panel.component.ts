import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { BuilderAdminRecord, BuilderStatusHistoryRecord } from '../../models/builder-admin.model';
import { BuilderStatusBadgeComponent } from '../shared/builder-status-badge.component';
import { BuilderStatusHistoryComponent } from './builder-status-history.component';

@Component({
  selector: 'app-bldr-status-panel',
  imports: [DatePipe, ButtonComponent, BuilderStatusBadgeComponent, BuilderStatusHistoryComponent],
  template: `
    <section class="bldr-status-panel" aria-label="Builder status">
      <div class="bldr-status-panel__current">
        <h3 class="mpa-heading-sm">Current status</h3>
        <app-bldr-status-badge [status]="builder().status" />
        <p class="bldr-status-panel__updated">Updated {{ builder().updatedAt | date: 'medium' }}</p>
      </div>
      <div class="bldr-status-panel__actions">
        @if (builder().status !== 'active') {
          <app-button label="Activate" icon="pi pi-check" size="small" (clicked)="statusChange.emit('active')" />
        }
        @if (builder().status === 'inactive') {
          <app-button label="Reactivate" icon="pi pi-replay" size="small" (clicked)="statusChange.emit('active')" />
        }
        @if (builder().status === 'active' || builder().status === 'pending') {
          <app-button label="Suspend" icon="pi pi-ban" size="small" severity="warn" [outlined]="true" (clicked)="statusChange.emit('inactive')" />
        }
        @if (builder().status !== 'inactive' && builder().status !== 'archived') {
          <app-button label="Deactivate" icon="pi pi-pause" size="small" [outlined]="true" (clicked)="statusChange.emit('inactive')" />
        }
        @if (builder().status !== 'archived') {
          <app-button label="Delete (soft)" icon="pi pi-trash" size="small" severity="danger" [outlined]="true" (clicked)="statusChange.emit('archived')" />
        }
        @if (builder().status === 'archived') {
          <app-button label="Restore" icon="pi pi-replay" size="small" (clicked)="statusChange.emit('active')" />
        }
      </div>
      <app-bldr-status-history [items]="history()" />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderStatusPanelComponent {
  readonly builder = input.required<BuilderAdminRecord>();
  readonly history = input.required<readonly BuilderStatusHistoryRecord[]>();
  readonly statusChange = output<BuilderAdminRecord['status']>();
}
