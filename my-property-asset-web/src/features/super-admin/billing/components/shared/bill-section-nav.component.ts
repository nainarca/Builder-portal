import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BILLING_SECTIONS } from '../../config/billing.config';

@Component({
  selector: 'app-bill-section-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bill-section-nav" aria-label="Billing sections">
      @for (section of sections; track section.id) {
        <a
          [routerLink]="section.route"
          routerLinkActive="bill-section-nav__link--active"
          [routerLinkActiveOptions]="{ exact: section.id === 'dashboard' }"
          class="bill-section-nav__link"
        >
          <i [class]="section.icon" aria-hidden="true"></i>
          {{ section.label }}
        </a>
      }
    </nav>
  `,
  styles: `
    .bill-section-nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs, 0.5rem);
      border-bottom: 1px solid var(--mpa-color-border);
      margin-bottom: var(--mpa-spacing-md, 1rem);
    }

    .bill-section-nav__link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1rem;
      color: var(--mpa-color-text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      border-bottom: 2px solid transparent;
      transition:
        color 0.15s ease,
        border-color 0.15s ease;
      white-space: nowrap;
    }

    .bill-section-nav__link:hover {
      color: var(--mpa-color-text);
    }

    .bill-section-nav__link--active {
      color: var(--mpa-color-primary);
      border-bottom-color: var(--mpa-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillSectionNavComponent {
  readonly sections = BILLING_SECTIONS;
}
