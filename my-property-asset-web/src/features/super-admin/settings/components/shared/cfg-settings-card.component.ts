import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigurationStatus } from '../../models/settings-admin.model';
import { CfgConfigurationBadgeComponent } from './cfg-configuration-badge.component';

@Component({
  selector: 'app-cfg-settings-card',
  imports: [CfgConfigurationBadgeComponent],
  template: `
    <button type="button" class="cfg-card" [class.cfg-card--linked]="!!route()" (click)="onClick()">
      <span class="cfg-card__header">
        @if (icon()) {
          <span class="cfg-card__icon" aria-hidden="true">
            <i [class]="icon()"></i>
          </span>
        }
        @if (status(); as value) {
          <app-cfg-configuration-badge class="cfg-card__badge" [status]="value" />
        }
      </span>
      <span class="cfg-card__body">
        <span class="cfg-card__title">{{ title() }}</span>
        @if (description()) {
          <span class="cfg-card__description">{{ description() }}</span>
        }
      </span>
      @if (route()) {
        <span class="cfg-card__footer">
          <i class="pi pi-arrow-right" aria-hidden="true"></i>
        </span>
      }
    </button>
  `,
  styles: `
    .cfg-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      height: 100%;
      text-align: left;
      padding: 1.1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      cursor: default;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
    }
    .cfg-card--linked {
      cursor: pointer;
    }
    .cfg-card--linked:hover {
      border-color: var(--mpa-color-primary);
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }
    .cfg-card--linked:focus-visible {
      outline: none;
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 2px var(--mpa-color-primary);
    }
    .cfg-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .cfg-card__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
      font-size: 1.1rem;
    }
    .cfg-card__badge {
      margin-left: auto;
    }
    .cfg-card__body {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      flex: 1;
    }
    .cfg-card__title {
      font-weight: 600;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }
    .cfg-card__description {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.4;
    }
    .cfg-card__footer {
      display: flex;
      justify-content: flex-end;
      color: var(--mpa-color-primary);
      font-size: 0.9rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSettingsCardComponent {
  private readonly router = inject(Router);

  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<string>('');
  readonly route = input<string>();
  readonly status = input<ConfigurationStatus>();

  readonly selectCard = output<void>();

  onClick(): void {
    this.selectCard.emit();
    const target = this.route();
    if (target) {
      void this.router.navigateByUrl(target);
    }
  }
}
