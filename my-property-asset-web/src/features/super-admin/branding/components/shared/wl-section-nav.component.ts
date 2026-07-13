import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-wl-section-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="wl-section-nav" aria-label="Branding sections">
      <a
        routerLink="/super-admin/branding"
        routerLinkActive="wl-section-nav__link--active"
        [routerLinkActiveOptions]="{ exact: true }"
        class="wl-section-nav__link"
      >
        <i class="pi pi-th-large" aria-hidden="true"></i> Dashboard
      </a>
      <a
        routerLink="/super-admin/branding/studio"
        routerLinkActive="wl-section-nav__link--active"
        class="wl-section-nav__link"
      >
        <i class="pi pi-palette" aria-hidden="true"></i> Studio
      </a>
    </nav>
  `,
  styles: `
    .wl-section-nav {
      display: flex;
      gap: var(--mpa-spacing-xs, 0.5rem);
      border-bottom: 1px solid var(--mpa-color-border);
      margin-bottom: var(--mpa-spacing-md, 1rem);
    }
    .wl-section-nav__link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1rem;
      color: var(--mpa-color-text-muted);
      text-decoration: none;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      transition: color 0.15s ease, border-color 0.15s ease;
    }
    .wl-section-nav__link:hover {
      color: var(--mpa-color-text);
    }
    .wl-section-nav__link--active {
      color: var(--mpa-color-primary);
      border-bottom-color: var(--mpa-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlSectionNavComponent {}
