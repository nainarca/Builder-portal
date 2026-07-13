import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FeatureFlagSetting } from '../../models/settings-admin.model';

@Component({
  selector: 'app-cfg-feature-flag-card',
  template: `
    @if (flag(); as item) {
      <article class="cfg-feature-flag-card" [class.cfg-feature-flag-card--on]="item.enabled">
        <div class="cfg-feature-flag-card__info">
          <div class="cfg-feature-flag-card__title-row">
            <span class="cfg-feature-flag-card__label">{{ item.label }}</span>
            <span class="cfg-feature-flag-card__env">{{ item.environment }}</span>
          </div>
          <p class="cfg-feature-flag-card__description">{{ item.description }}</p>
        </div>
        <label class="cfg-toggle" [class.cfg-toggle--disabled]="disabled()">
          <input
            type="checkbox"
            class="cfg-toggle__input"
            [checked]="item.enabled"
            [disabled]="disabled()"
            [attr.aria-label]="'Toggle ' + item.label"
            (change)="onToggle($event)"
          />
          <span class="cfg-toggle__track" aria-hidden="true">
            <span class="cfg-toggle__thumb"></span>
          </span>
        </label>
      </article>
    }
  `,
  styles: `
    .cfg-feature-flag-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.15rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
      transition: border-color 0.15s ease;
    }
    .cfg-feature-flag-card--on {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 45%, var(--mpa-color-border));
    }
    .cfg-feature-flag-card__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      min-width: 0;
    }
    .cfg-feature-flag-card__title-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }
    .cfg-feature-flag-card__label {
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-feature-flag-card__env {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 12%, transparent);
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
    }
    .cfg-feature-flag-card__description {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-toggle {
      position: relative;
      display: inline-flex;
      flex: none;
      cursor: pointer;
    }
    .cfg-toggle--disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .cfg-toggle__input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: inherit;
    }
    .cfg-toggle__track {
      display: inline-flex;
      align-items: center;
      width: 2.6rem;
      height: 1.5rem;
      padding: 0.15rem;
      border-radius: 999px;
      background: var(--mpa-color-border);
      transition: background 0.15s ease;
    }
    .cfg-toggle__thumb {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform 0.15s ease;
    }
    .cfg-toggle__input:checked + .cfg-toggle__track {
      background: var(--mpa-color-primary);
    }
    .cfg-toggle__input:checked + .cfg-toggle__track .cfg-toggle__thumb {
      transform: translateX(1.1rem);
    }
    .cfg-toggle__input:focus-visible + .cfg-toggle__track {
      outline: 2px solid var(--mpa-color-primary);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgFeatureFlagCardComponent {
  readonly flag = input.required<FeatureFlagSetting>();
  readonly disabled = input(false);

  readonly toggled = output<boolean>();

  onToggle(event: Event): void {
    this.toggled.emit((event.target as HTMLInputElement).checked);
  }
}
