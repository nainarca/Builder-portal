import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import type {
  EnterpriseDashboardAccountHealth,
  EnterpriseDashboardAttentionItem,
} from '../models/enterprise-dashboard.models';

/**
 * Attention list — Zone 2 of the four-zone dashboard (UI-REBIRTH §3).
 * Empty = calm "You're all caught up" (that emptiness is the good news).
 */
@Component({
  selector: 'app-enterprise-dashboard-attention-list',
  imports: [RouterLink],
  template: `
    <section
      class="enterprise-attention"
      role="region"
      [attr.aria-label]="ariaLabel()"
    >
      @if (title()) {
        <header class="enterprise-attention__header">
          <h2 class="enterprise-attention__title">{{ title() }}</h2>
          @if (description()) {
            <p class="enterprise-attention__description">{{ description() }}</p>
          }
        </header>
      }

      @if (items().length === 0) {
        <div class="enterprise-attention__caught-up" role="status">
          <i class="pi pi-check-circle" aria-hidden="true"></i>
          <div>
            <p class="enterprise-attention__caught-up-title">{{ emptyTitle() }}</p>
            <p class="enterprise-attention__caught-up-copy">{{ emptyDescription() }}</p>
          </div>
        </div>
      } @else {
        <ul class="enterprise-attention__list" role="list">
          @for (item of items(); track item.id) {
            <li
              class="enterprise-attention__item"
              [attr.data-severity]="item.severity ?? 'info'"
            >
              <span class="enterprise-attention__icon" aria-hidden="true">
                <i [class]="item.icon ?? 'pi pi-exclamation-circle'"></i>
              </span>
              <div class="enterprise-attention__body">
                <p class="enterprise-attention__item-title">{{ item.title }}</p>
                @if (item.description) {
                  <p class="enterprise-attention__item-description">{{ item.description }}</p>
                }
              </div>
              @if (item.href && item.actionLabel) {
                <a
                  class="enterprise-attention__action mpa-focus-visible"
                  [routerLink]="item.href"
                >
                  {{ item.actionLabel }}
                </a>
              } @else if (item.actionLabel) {
                <button
                  type="button"
                  class="enterprise-attention__action mpa-focus-visible"
                  (click)="action.emit(item.id)"
                >
                  {{ item.actionLabel }}
                </button>
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: `
    .enterprise-attention {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-attention__header {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-attention__title {
      margin: 0;
      font-size: var(--mpa-font-size-lg);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--mpa-color-text);
    }
    .enterprise-attention__description {
      margin: 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-attention__caught-up {
      display: flex;
      align-items: flex-start;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-lg);
      border-radius: var(--mpa-radius-lg);
      border: 1px solid color-mix(in srgb, var(--mpa-color-success) 28%, var(--mpa-color-border));
      background: color-mix(in srgb, var(--mpa-color-success) 8%, var(--mpa-color-surface));
    }
    .enterprise-attention__caught-up .pi {
      color: var(--mpa-color-success);
      font-size: var(--mpa-icon-size-md);
      margin-top: var(--mpa-spacing-xs);
    }
    .enterprise-attention__caught-up-title {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-attention__caught-up-copy {
      margin: var(--mpa-spacing-xs) 0 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-attention__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-attention__item {
      display: flex;
      align-items: flex-start;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface);
      transition:
        border-color var(--mpa-transition-fast),
        box-shadow var(--mpa-transition-fast),
        transform var(--mpa-transition-fast);
    }
    .enterprise-attention__item:hover {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 28%, var(--mpa-color-border));
      box-shadow: var(--mpa-elevation-sm);
    }
    .enterprise-attention__item[data-severity='warn'] {
      border-color: color-mix(in srgb, var(--mpa-color-warning, #d97706) 35%, var(--mpa-color-border));
    }
    .enterprise-attention__item[data-severity='error'] {
      border-color: color-mix(in srgb, var(--mpa-color-danger) 35%, var(--mpa-color-border));
    }
    .enterprise-attention__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--mpa-avatar-size-sm);
      height: var(--mpa-avatar-size-sm);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-muted);
      color: var(--mpa-color-primary);
      flex-shrink: 0;
    }
    .enterprise-attention__item[data-severity='warn'] .enterprise-attention__icon {
      color: var(--mpa-color-warning, #d97706);
    }
    .enterprise-attention__item[data-severity='error'] .enterprise-attention__icon {
      color: var(--mpa-color-danger);
    }
    .enterprise-attention__body {
      flex: 1 1 auto;
      min-width: 0;
    }
    .enterprise-attention__item-title {
      margin: 0;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-attention__item-description {
      margin: var(--mpa-spacing-xs) 0 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-attention__action {
      flex-shrink: 0;
      align-self: center;
      border: 0;
      background: transparent;
      color: var(--mpa-color-primary);
      font: inherit;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
      text-decoration: none;
      cursor: pointer;
      padding: var(--mpa-spacing-xs) var(--mpa-spacing-sm);
      border-radius: var(--mpa-radius-md);
    }
    .enterprise-attention__action:hover {
      background: var(--mpa-color-primary-subtle);
    }
    .enterprise-attention__action:focus-visible {
      outline: 2px solid var(--mpa-color-focus);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardAttentionListComponent {
  readonly title = input('Needs attention');
  readonly description = input<string | undefined>(undefined);
  readonly ariaLabel = input('Attention');
  readonly items = input<readonly EnterpriseDashboardAttentionItem[]>([]);
  readonly emptyTitle = input("You're all caught up");
  readonly emptyDescription = input(
    'No overdue handovers, stalled projects, or pending approvals need you right now.',
  );

  readonly action = output<string>();
}

/**
 * Single-line account health — Settings only; never a dashboard zone of cards.
 */
@Component({
  selector: 'app-enterprise-dashboard-account-health',
  imports: [RouterLink],
  template: `
    @if (health(); as item) {
      <p
        class="enterprise-account-health"
        [class.enterprise-account-health--attention]="item.tone === 'attention'"
        role="status"
      >
        <i
          class="pi"
          [class.pi-check-circle]="item.tone !== 'attention'"
          [class.pi-info-circle]="item.tone === 'attention'"
          aria-hidden="true"
        ></i>
        <span class="enterprise-account-health__label">{{ item.label }}</span>
        @if (item.detail) {
          <span class="enterprise-account-health__detail">{{ item.detail }}</span>
        }
        <a class="enterprise-account-health__link mpa-focus-visible" [routerLink]="item.href">
          Settings
        </a>
      </p>
    }
  `,
  styles: `
    .enterprise-account-health {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      margin: 0;
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-muted);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm);
    }
    .enterprise-account-health--attention {
      background: color-mix(in srgb, var(--mpa-color-warning, #d97706) 10%, var(--mpa-color-surface));
      color: var(--mpa-color-text);
    }
    .enterprise-account-health__label {
      font-weight: var(--mpa-font-weight-medium);
      color: var(--mpa-color-text);
    }
    .enterprise-account-health__detail {
      flex: 1 1 auto;
    }
    .enterprise-account-health__link {
      margin-inline-start: auto;
      color: var(--mpa-color-primary);
      font-weight: var(--mpa-font-weight-medium);
      text-decoration: none;
      border-radius: var(--mpa-radius-sm);
    }
    .enterprise-account-health__link:hover {
      text-decoration: underline;
    }
    .enterprise-account-health__link:focus-visible {
      outline: 2px solid var(--mpa-color-focus);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardAccountHealthComponent {
  readonly health = input<EnterpriseDashboardAccountHealth | null>(null);
}
