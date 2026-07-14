import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { formatOpsDate } from '../../config/operations.config';
import { AuditLogRecord } from '../../models/operations-admin.model';
import { OpsStatusBadgeComponent } from './ops-status-badge.component';

@Component({
  selector: 'app-ops-activity-card',
  imports: [OpsStatusBadgeComponent],
  template: `
    @if (entry(); as row) {
      <button type="button" class="ops-activity-card" (click)="selectEntry.emit(row.id)">
        <div class="ops-activity-card__main">
          <span class="ops-activity-card__action">{{ row.action }}</span>
          <span class="ops-activity-card__summary">{{ row.summary }}</span>
          <span class="ops-activity-card__meta">
            {{ row.actorName }} · {{ formatDate(row.timestamp) }}
            @if (row.organizationName) { · {{ row.organizationName }} }
          </span>
        </div>
        <div class="ops-activity-card__side">
          <app-ops-status-badge [status]="row.outcome" />
          <span class="ops-activity-card__cat">{{ row.category }}</span>
        </div>
      </button>
    }
  `,
  styles: `
    .ops-activity-card {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      text-align: left;
      padding: 0.95rem 1.1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      cursor: pointer;
      transition: border-color 0.15s ease, transform 0.15s ease;
    }
    .ops-activity-card:hover {
      border-color: var(--mpa-color-primary);
      transform: translateY(-1px);
    }
    .ops-activity-card__main {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }
    .ops-activity-card__action {
      font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }
    .ops-activity-card__summary {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .ops-activity-card__meta {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .ops-activity-card__side {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
      flex: none;
    }
    .ops-activity-card__cat {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      text-transform: capitalize;
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsActivityCardComponent {
  readonly entry = input.required<AuditLogRecord>();
  readonly selectEntry = output<string>();
  formatDate = formatOpsDate;
}
