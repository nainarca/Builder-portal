import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { EnterpriseSettingsNavItem } from './models/enterprise-workspace.models';

/** Settings sidebar navigation — categorized links (presentation). */
@Component({
  selector: 'app-enterprise-settings-navigation',
  imports: [RouterLink],
  template: `
    <nav
      class="enterprise-settings-nav"
      [attr.aria-label]="ariaLabel()"
    >
      @if (title()) {
        <p class="enterprise-settings-nav__title">{{ title() }}</p>
      }
      <ul class="enterprise-settings-nav__list" role="list">
        @for (item of items(); track item.id) {
          <li>
            @if (item.href) {
              <a
                class="enterprise-settings-nav__link"
                [class.enterprise-settings-nav__link--active]="item.active"
                [routerLink]="item.href"
                [attr.aria-current]="item.active ? 'page' : null"
              >
                @if (item.icon) {
                  <i [class]="item.icon" aria-hidden="true"></i>
                }
                <span class="enterprise-settings-nav__label">
                  <span>{{ item.label }}</span>
                  @if (item.description) {
                    <small>{{ item.description }}</small>
                  }
                </span>
              </a>
            } @else {
              <button
                type="button"
                class="enterprise-settings-nav__link"
                [class.enterprise-settings-nav__link--active]="item.active"
                [attr.aria-current]="item.active ? 'true' : null"
                (click)="itemSelect.emit(item)"
              >
                @if (item.icon) {
                  <i [class]="item.icon" aria-hidden="true"></i>
                }
                <span class="enterprise-settings-nav__label">
                  <span>{{ item.label }}</span>
                  @if (item.description) {
                    <small>{{ item.description }}</small>
                  }
                </span>
              </button>
            }
          </li>
        }
      </ul>
      <ng-content />
    </nav>
  `,
  styles: `
    .enterprise-settings-nav {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
      min-width: 0;
    }
    .enterprise-settings-nav__title {
      margin: 0;
      padding: 0 var(--mpa-spacing-xs);
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }
    .enterprise-settings-nav__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .enterprise-settings-nav__link {
      display: flex;
      align-items: flex-start;
      gap: var(--mpa-spacing-sm);
      width: 100%;
      margin: 0;
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      border: 0;
      border-radius: var(--mpa-radius-md);
      background: transparent;
      color: var(--mpa-color-text);
      text-align: left;
      text-decoration: none;
      cursor: pointer;
      font: inherit;
      transition:
        background-color var(--mpa-motion-fast, 120ms) ease,
        color var(--mpa-motion-fast, 120ms) ease;
    }
    .enterprise-settings-nav__link:hover {
      background: var(--mpa-color-surface-muted);
    }
    .enterprise-settings-nav__link:focus-visible {
      outline: 2px solid var(--mpa-color-primary);
      outline-offset: 2px;
    }
    .enterprise-settings-nav__link--active {
      background: var(--mpa-color-primary-subtle, var(--mpa-color-surface-muted));
      color: var(--mpa-color-primary);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-settings-nav__label {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
    }
    .enterprise-settings-nav__label small {
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-regular);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseSettingsNavigationComponent {
  readonly items = input.required<readonly EnterpriseSettingsNavItem[]>();
  readonly title = input<string | undefined>('Settings');
  readonly ariaLabel = input('Settings categories');
  readonly itemSelect = output<EnterpriseSettingsNavItem>();
}
