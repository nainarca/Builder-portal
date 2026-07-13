import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ConfigurationStatus, IntegrationStatus } from '../../models/settings-admin.model';

type StatusTone = 'success' | 'warning' | 'danger' | 'muted';

const STATUS_TONES: Record<IntegrationStatus | ConfigurationStatus, StatusTone> = {
  connected: 'success',
  healthy: 'success',
  disconnected: 'muted',
  draft: 'muted',
  planned: 'warning',
  warning: 'warning',
  error: 'danger',
};

@Component({
  selector: 'app-cfg-status-indicator',
  template: `
    <span class="cfg-status" [class]="toneClass()">
      <span class="cfg-status__dot" aria-hidden="true"></span>
      <span class="cfg-status__label">{{ label() || status() }}</span>
    </span>
  `,
  styles: `
    .cfg-status {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
      text-transform: capitalize;
    }
    .cfg-status__dot {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 50%;
      flex: none;
      background: var(--mpa-color-text-muted);
    }
    .cfg-status--success .cfg-status__dot {
      background: var(--mpa-color-success);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mpa-color-success) 20%, transparent);
    }
    .cfg-status--warning .cfg-status__dot {
      background: var(--mpa-color-warning);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mpa-color-warning) 20%, transparent);
    }
    .cfg-status--danger .cfg-status__dot {
      background: var(--mpa-color-danger);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mpa-color-danger) 20%, transparent);
    }
    .cfg-status--muted .cfg-status__dot {
      background: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgStatusIndicatorComponent {
  readonly status = input.required<IntegrationStatus | ConfigurationStatus>();
  readonly label = input<string>('');

  readonly toneClass = computed(() => `cfg-status cfg-status--${STATUS_TONES[this.status()]}`);
}
