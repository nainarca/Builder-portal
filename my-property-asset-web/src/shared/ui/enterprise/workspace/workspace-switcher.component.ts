import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OrganizationSelectorComponent } from '@core/organization-context';

import type { EnterpriseWorkspaceInfo } from './models/enterprise-workspace.models';

/**
 * Workspace switcher — presentation alias over the live organization selector
 * (UI-REBIRTH §2 / UI-IMP-01). No duplicate switch logic.
 */
@Component({
  selector: 'app-enterprise-workspace-switcher',
  imports: [OrganizationSelectorComponent],
  template: `
    <div
      class="enterprise-workspace-switcher"
      [class.enterprise-workspace-switcher--compact]="compact()"
      role="group"
      [attr.aria-label]="ariaLabel()"
    >
      <app-organization-selector [variant]="variant()" [compact]="compact()" />
      @if (showInfo() && info(); as workspace) {
        <p class="enterprise-workspace-switcher__info" role="status">
          <span class="enterprise-workspace-switcher__info-label">Current workspace</span>
          <span class="enterprise-workspace-switcher__info-name">{{ workspace.name }}</span>
          @if (workspace.subtitle) {
            <span class="enterprise-workspace-switcher__info-sub">{{ workspace.subtitle }}</span>
          }
        </p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .enterprise-workspace-switcher {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
      min-width: 0;
      width: 100%;
    }
    .enterprise-workspace-switcher__info {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      margin: 0;
      padding: 0 var(--mpa-spacing-xs);
    }
    .enterprise-workspace-switcher__info-label {
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }
    .enterprise-workspace-switcher__info-name {
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
      color: var(--mpa-color-text);
    }
    .enterprise-workspace-switcher__info-sub {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseWorkspaceSwitcherComponent {
  readonly variant = input<'sidebar' | 'header'>('sidebar');
  readonly compact = input(false);
  readonly showInfo = input(false);
  readonly info = input<EnterpriseWorkspaceInfo | undefined>(undefined);
  readonly ariaLabel = input('Workspace switcher');
}
