import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import {
  EnterpriseDetailActionPanelComponent,
  TimelineCardComponent,
  type EnterpriseDetailAction,
  type EnterpriseTimelineEvent,
} from '@shared/ui';

import { OrganizationAdminRecord, OrganizationStatusHistoryRecord } from '../../models/organization-admin.model';
import { OrganizationStatusBadgeComponent } from '../shared/organization-status-badge.component';

@Component({
  selector: 'app-org-status-panel',
  imports: [
    DatePipe,
    EnterpriseDetailActionPanelComponent,
    OrganizationStatusBadgeComponent,
    TimelineCardComponent,
  ],
  template: `
    <div class="org-status-panel" aria-label="Organization status">
      <app-enterprise-detail-action-panel
        title="Lifecycle status"
        [actions]="lifecycleActions()"
        [dangerActions]="dangerActions()"
        dangerDescription="Archiving hides this organization from active directories."
        (actionClick)="onAction($event)"
      >
        <div class="org-status-panel__current">
          <app-org-status-badge [status]="org().status" />
          <p class="org-status-panel__updated">Last updated {{ org().updatedAt | date: 'medium' }}</p>
        </div>
      </app-enterprise-detail-action-panel>

      @if (historyEvents().length) {
        <app-timeline-card title="Status history" [events]="historyEvents()" />
      }
    </div>
  `,
  styles: `
    .org-status-panel {
      display: grid;
      gap: var(--mpa-spacing-lg);
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationStatusPanelComponent {
  readonly org = input.required<OrganizationAdminRecord>();
  readonly history = input.required<readonly OrganizationStatusHistoryRecord[]>();

  readonly statusChange = output<OrganizationAdminRecord['status']>();

  readonly lifecycleActions = computed((): readonly EnterpriseDetailAction[] => {
    const status = this.org().status;
    const actions: EnterpriseDetailAction[] = [];
    if (status !== 'active') {
      actions.push({ id: 'active', label: 'Activate', icon: 'pi pi-check' });
    }
    if (status !== 'inactive' && status !== 'archived') {
      actions.push({ id: 'inactive', label: 'Deactivate', icon: 'pi pi-pause' });
    }
    if (status === 'archived') {
      actions.push({ id: 'restore', label: 'Restore', icon: 'pi pi-replay' });
    }
    return actions;
  });

  readonly dangerActions = computed((): readonly EnterpriseDetailAction[] => {
    if (this.org().status === 'archived') {
      return [];
    }
    return [{ id: 'archived', label: 'Archive', icon: 'pi pi-archive', severity: 'danger' }];
  });

  readonly historyEvents = computed((): readonly EnterpriseTimelineEvent[] =>
    this.history().map((item) => ({
      id: item.id,
      title: item.status,
      description: `${item.reason || 'Status updated'} · ${item.changedBy}`,
      timestamp: new Date(item.changedAt).toLocaleString(),
      absoluteTimestamp: item.changedAt,
      icon: 'pi pi-history',
    })),
  );

  onAction(actionId: string): void {
    if (actionId === 'restore') {
      this.statusChange.emit('active');
      return;
    }
    if (actionId === 'active' || actionId === 'inactive' || actionId === 'archived') {
      this.statusChange.emit(actionId);
    }
  }
}
