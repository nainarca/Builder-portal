import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ConfigurationStatus } from '../../models/settings-admin.model';

interface ConfigurationBadgeView {
  readonly label: string;
  readonly icon: string;
  readonly modifier: string;
}

const CONFIGURATION_BADGE_MAP: Record<ConfigurationStatus, ConfigurationBadgeView> = {
  healthy: { label: 'Healthy', icon: 'pi pi-check-circle', modifier: 'cfg-configuration-badge--healthy' },
  warning: { label: 'Warning', icon: 'pi pi-exclamation-triangle', modifier: 'cfg-configuration-badge--warning' },
  error: { label: 'Error', icon: 'pi pi-times-circle', modifier: 'cfg-configuration-badge--error' },
  draft: { label: 'Draft', icon: 'pi pi-pencil', modifier: 'cfg-configuration-badge--draft' },
};

@Component({
  selector: 'app-cfg-configuration-badge',
  template: `
    <span class="cfg-configuration-badge" [class]="view().modifier">
      <i [class]="view().icon" aria-hidden="true"></i>
      <span class="cfg-configuration-badge__label">{{ label() ?? view().label }}</span>
    </span>
  `,
  styles: `
    .cfg-configuration-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.7rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      line-height: 1;
      border: 1px solid transparent;
    }
    .cfg-configuration-badge i {
      font-size: 0.85em;
    }
    .cfg-configuration-badge--healthy {
      color: var(--mpa-color-success, #15803d);
      background: color-mix(in srgb, var(--mpa-color-success, #15803d) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-success, #15803d) 30%, transparent);
    }
    .cfg-configuration-badge--warning {
      color: var(--mpa-color-warning, #b45309);
      background: color-mix(in srgb, var(--mpa-color-warning, #b45309) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-warning, #b45309) 30%, transparent);
    }
    .cfg-configuration-badge--error {
      color: var(--mpa-color-danger, #b91c1c);
      background: color-mix(in srgb, var(--mpa-color-danger, #b91c1c) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-danger, #b91c1c) 30%, transparent);
    }
    .cfg-configuration-badge--draft {
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 12%, transparent);
      border-color: var(--mpa-color-border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgConfigurationBadgeComponent {
  readonly status = input.required<ConfigurationStatus>();
  readonly label = input<string | undefined>(undefined);

  readonly view = computed<ConfigurationBadgeView>(() => CONFIGURATION_BADGE_MAP[this.status()]);
}
