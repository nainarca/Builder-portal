import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SETTINGS_CATEGORIES } from '../../config/settings.config';
import { SettingsCategoryId, SettingsNavItem } from '../../models/settings-admin.model';

@Component({
  selector: 'app-cfg-settings-sidebar',
  imports: [RouterLink],
  template: `
    <nav class="cfg-sidebar" aria-label="Settings categories">
      <ul class="cfg-sidebar__list">
        @for (category of categories; track category.id) {
          <li class="cfg-sidebar__item">
            <a
              [routerLink]="category.route"
              class="cfg-sidebar__link"
              [class.cfg-sidebar__link--active]="category.id === activeCategory()"
              [attr.aria-current]="category.id === activeCategory() ? 'page' : null"
            >
              <i class="cfg-sidebar__icon" [class]="category.icon" aria-hidden="true"></i>
              <span class="cfg-sidebar__text">
                <span class="cfg-sidebar__label">{{ category.label }}</span>
                <span class="cfg-sidebar__description">{{ category.description }}</span>
              </span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    .cfg-sidebar {
      display: block;
    }
    .cfg-sidebar__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs, 0.35rem);
    }
    .cfg-sidebar__link {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.7rem 0.85rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      color: var(--mpa-color-text-muted);
      text-decoration: none;
      border: 1px solid transparent;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }
    .cfg-sidebar__link:hover {
      color: var(--mpa-color-text);
      background: var(--mpa-color-surface);
    }
    .cfg-sidebar__link--active {
      color: var(--mpa-color-primary);
      background: var(--mpa-color-surface);
      border-color: var(--mpa-color-primary);
    }
    .cfg-sidebar__icon {
      font-size: 1.05rem;
      margin-top: 0.1rem;
      flex: none;
    }
    .cfg-sidebar__text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }
    .cfg-sidebar__label {
      font-weight: 600;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .cfg-sidebar__description {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.3;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSettingsSidebarComponent {
  readonly activeCategory = input<SettingsCategoryId | null>(null);
  readonly categories: readonly SettingsNavItem[] = SETTINGS_CATEGORIES;
}
