import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SettingsNavItem } from '../../models/settings-admin.model';

@Component({
  selector: 'app-cfg-category-card',
  template: `
    @if (item(); as nav) {
      <button type="button" class="cfg-settings-card" (click)="activated.emit(nav)">
        <span class="cfg-settings-card__icon" aria-hidden="true">
          <i [class]="nav.icon"></i>
        </span>
        <span class="cfg-settings-card__body">
          <span class="cfg-settings-card__label">{{ nav.label }}</span>
          <span class="cfg-settings-card__description">{{ nav.description }}</span>
        </span>
        <span class="cfg-settings-card__chevron" aria-hidden="true">
          <i class="pi pi-arrow-right"></i>
        </span>
      </button>
    }
  `,
  styles: `
    .cfg-settings-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      text-align: left;
      padding: 1.15rem 1.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      cursor: pointer;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
    }
    .cfg-settings-card:hover {
      border-color: var(--mpa-color-primary);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }
    .cfg-settings-card:focus-visible {
      outline: 2px solid var(--mpa-color-primary);
      outline-offset: 2px;
    }
    .cfg-settings-card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
      font-size: 1.2rem;
      flex: none;
    }
    .cfg-settings-card__body {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      flex: 1;
      min-width: 0;
    }
    .cfg-settings-card__label {
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-settings-card__description {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-settings-card__chevron {
      color: var(--mpa-color-text-muted);
      transition: transform 0.15s ease, color 0.15s ease;
      flex: none;
    }
    .cfg-settings-card:hover .cfg-settings-card__chevron {
      color: var(--mpa-color-primary);
      transform: translateX(3px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgCategoryCardComponent {
  readonly item = input.required<SettingsNavItem>();
  readonly activated = output<SettingsNavItem>();
}
