import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AlertSeverity, HealthStatus } from '../../models/operations-admin.model';

type StatusTone = HealthStatus | AlertSeverity | 'success' | 'failure' | 'denied' | string;

@Component({
  selector: 'app-ops-status-badge',
  template: `
    <span class="ops-status" [class]="'ops-status--' + tone()">
      <span class="ops-status__dot" aria-hidden="true"></span>
      {{ label() || tone() }}
    </span>
  `,
  styles: `
    .ops-status {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: capitalize;
      border: 1px solid transparent;
    }
    .ops-status__dot {
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 50%;
      background: currentColor;
    }
    .ops-status--healthy, .ops-status--success, .ops-status--info {
      color: var(--mpa-color-success, #16a34a);
      background: color-mix(in srgb, var(--mpa-color-success, #16a34a) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-success, #16a34a) 25%, transparent);
    }
    .ops-status--info {
      color: var(--mpa-color-info, #2563eb);
      background: color-mix(in srgb, var(--mpa-color-info, #2563eb) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-info, #2563eb) 25%, transparent);
    }
    .ops-status--degraded, .ops-status--warning {
      color: var(--mpa-color-warning, #d97706);
      background: color-mix(in srgb, var(--mpa-color-warning, #d97706) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-warning, #d97706) 25%, transparent);
    }
    .ops-status--down, .ops-status--critical, .ops-status--failure, .ops-status--denied {
      color: var(--mpa-color-danger, #dc2626);
      background: color-mix(in srgb, var(--mpa-color-danger, #dc2626) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-danger, #dc2626) 25%, transparent);
    }
    .ops-status--unknown {
      color: var(--mpa-color-text-muted);
      background: var(--mpa-color-surface-muted, #f1f5f9);
      border-color: var(--mpa-color-border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsStatusBadgeComponent {
  readonly status = input.required<StatusTone>();
  readonly label = input<string>('');
  readonly tone = computed(() => String(this.status()).replace(/_/g, '-'));
}
