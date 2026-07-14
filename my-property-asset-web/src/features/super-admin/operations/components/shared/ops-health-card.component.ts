import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { formatOpsDate } from '../../config/operations.config';
import { HealthServiceRecord } from '../../models/operations-admin.model';
import { OpsStatusBadgeComponent } from './ops-status-badge.component';

@Component({
  selector: 'app-ops-health-card',
  imports: [OpsStatusBadgeComponent],
  template: `
    @if (service(); as svc) {
      <article class="ops-health-card">
        <header class="ops-health-card__head">
          <h3 class="ops-health-card__title">{{ svc.name }}</h3>
          <app-ops-status-badge [status]="svc.status" />
        </header>
        <p class="ops-health-card__message">{{ svc.message }}</p>
        <dl class="ops-health-card__meta">
          <div><dt>Latency</dt><dd>{{ svc.latencyMs }} ms</dd></div>
          <div><dt>Uptime</dt><dd>{{ svc.uptimePercent }}%</dd></div>
          <div><dt>Checked</dt><dd>{{ formatDate(svc.lastCheckedAt) }}</dd></div>
        </dl>
      </article>
    }
  `,
  styles: `
    .ops-health-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.15rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .ops-health-card:hover {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 35%, transparent);
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
    }
    .ops-health-card__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .ops-health-card__title {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .ops-health-card__message {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.45;
    }
    .ops-health-card__meta {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.5rem;
      margin: 0;
    }
    .ops-health-card__meta dt {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .ops-health-card__meta dd {
      margin: 0.15rem 0 0;
      font-weight: 600;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsHealthCardComponent {
  readonly service = input.required<HealthServiceRecord>();
  formatDate = formatOpsDate;
}
