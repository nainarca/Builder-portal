import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { OPS_SECTIONS } from '../../config/operations.config';
import { OpsNavItem } from '../../models/operations-admin.model';

@Component({
  selector: 'app-ops-section-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="ops-section-nav" aria-label="Operations sections">
      @for (section of sections; track section.id) {
        <a
          [routerLink]="section.route"
          routerLinkActive="ops-section-nav__link--active"
          [routerLinkActiveOptions]="{ exact: section.id === 'dashboard' }"
          class="ops-section-nav__link"
        >
          <i [class]="section.icon" aria-hidden="true"></i> {{ section.label }}
        </a>
      }
    </nav>
  `,
  styles: `
    .ops-section-nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs, 0.5rem);
      border-bottom: 1px solid var(--mpa-color-border);
      margin-bottom: var(--mpa-spacing-md, 1rem);
    }
    .ops-section-nav__link {
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
    .ops-section-nav__link:hover { color: var(--mpa-color-text); }
    .ops-section-nav__link--active {
      color: var(--mpa-color-primary);
      border-bottom-color: var(--mpa-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsSectionNavComponent {
  readonly sections: readonly OpsNavItem[] = OPS_SECTIONS;
}
