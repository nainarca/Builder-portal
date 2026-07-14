import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { formatOpsDate } from '../../config/operations.config';
import { IncidentRecord } from '../../models/operations-admin.model';
import { OpsStatusBadgeComponent } from './ops-status-badge.component';

@Component({
  selector: 'app-ops-incident-card',
  imports: [OpsStatusBadgeComponent],
  template: `
    @if (incident(); as item) {
      <article class="ops-incident-card">
        <header>
          <h3>{{ item.title }}</h3>
          <app-ops-status-badge [status]="item.severity" />
        </header>
        <p>{{ item.summary }}</p>
        <footer>
          <app-ops-status-badge [status]="item.status" [label]="item.status" />
          <span>Updated {{ formatDate(item.updatedAt) }}</span>
        </footer>
      </article>
    }
  `,
  styles: `
    .ops-incident-card {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 1.1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .ops-incident-card header {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .ops-incident-card h3 {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }
    .ops-incident-card p {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.45;
    }
    .ops-incident-card footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsIncidentCardComponent {
  readonly incident = input.required<IncidentRecord>();
  formatDate = formatOpsDate;
}
