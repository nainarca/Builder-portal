import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SETTINGS_CATEGORIES } from '../../config/settings.config';
import { SettingsNavItem } from '../../models/settings-admin.model';

@Component({
  selector: 'app-cfg-section-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="cfg-section-nav" aria-label="Settings sections">
      <a
        routerLink="/super-admin/settings"
        routerLinkActive="cfg-section-nav__link--active"
        [routerLinkActiveOptions]="{ exact: true }"
        class="cfg-section-nav__link"
      >
        <i class="pi pi-th-large" aria-hidden="true"></i> Dashboard
      </a>
      @for (category of categories; track category.id) {
        <a
          [routerLink]="category.route"
          routerLinkActive="cfg-section-nav__link--active"
          class="cfg-section-nav__link"
        >
          <i [class]="category.icon" aria-hidden="true"></i> {{ category.label }}
        </a>
      }
    </nav>
  `,
  styles: `
    .cfg-section-nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs, 0.5rem);
      border-bottom: 1px solid var(--mpa-color-border);
      margin-bottom: var(--mpa-spacing-md, 1rem);
    }
    .cfg-section-nav__link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1rem;
      color: var(--mpa-color-text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      border-bottom: 2px solid transparent;
      transition: color 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }
    .cfg-section-nav__link:hover {
      color: var(--mpa-color-text);
    }
    .cfg-section-nav__link--active {
      color: var(--mpa-color-primary);
      border-bottom-color: var(--mpa-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSectionNavComponent {
  readonly categories: readonly SettingsNavItem[] = SETTINGS_CATEGORIES;
}
