import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HealthScoreSnapshot } from '../../models/operations-admin.model';
import { OpsStatusBadgeComponent } from './ops-status-badge.component';

@Component({
  selector: 'app-ops-system-status',
  imports: [OpsStatusBadgeComponent],
  template: `
    @if (snapshot(); as snap) {
      <div class="ops-system-status" role="status" [attr.aria-label]="'Platform health score ' + snap.score">
        <div class="ops-system-status__ring" [style.--score]="snap.score">
          <span class="ops-system-status__value">{{ snap.score }}</span>
        </div>
        <div class="ops-system-status__copy">
          <h3>Platform health</h3>
          <app-ops-status-badge [status]="snap.status" />
          <p>{{ snap.healthyCount }} healthy · {{ snap.degradedCount }} degraded · {{ snap.downCount }} down</p>
        </div>
      </div>
    }
  `,
  styles: `
    .ops-system-status {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, color-mix(in srgb, var(--mpa-color-primary) 8%, var(--mpa-color-surface)), var(--mpa-color-surface));
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }
    .ops-system-status__ring {
      --score: 100;
      width: 5.5rem;
      height: 5.5rem;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: conic-gradient(var(--mpa-color-primary) calc(var(--score) * 1%), var(--mpa-color-border) 0);
      flex: none;
    }
    .ops-system-status__value {
      width: 4.2rem;
      height: 4.2rem;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--mpa-color-surface);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--mpa-color-text);
    }
    .ops-system-status__copy h3 {
      margin: 0 0 0.4rem;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }
    .ops-system-status__copy p {
      margin: 0.5rem 0 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsSystemStatusComponent {
  readonly snapshot = input.required<HealthScoreSnapshot>();
}
